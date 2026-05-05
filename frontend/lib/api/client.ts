// axios 인스턴스 — 사전 refresh 인터셉터 + 401 fallback 포함 (ADR 0004)
import axios from 'axios';

import { API_BASE_URL } from '../base-url';

import {
  clearAuth,
  getAccessExpiresAt,
  getRefreshPromise,
  setAccessExpiresAt,
  setRefreshPromise,
} from './tokenStore';

// 401 fallback 시 실행할 콜백 — 상위 레이어(providers)가 등록 (lib → app 역방향 의존 방지)
type OnAuthFailure = () => void;
let onAuthFailure: OnAuthFailure | null = null;

// 인증 실패 콜백을 등록한다 — app/providers.tsx에서 QueryClient.clear() + router.push('/login') 주입
export const registerAuthFailureHandler = (handler: OnAuthFailure): void => {
  onAuthFailure = handler;
};

// axios 인스턴스 — withCredentials로 httpOnly 쿠키 자동 전송
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 사전 refresh 임계값 — access 만료까지 60초 이하면 미리 갱신 (ADR 0004: 시계 오차 + RTT 흡수)
const PROACTIVE_REFRESH_THRESHOLD_MS = 60_000;

// 요청 인터셉터 — access 만료 임박 시 refresh를 먼저 수행한다
apiClient.interceptors.request.use(async (config) => {
  // refresh 엔드포인트 자체는 사전 분기에서 제외 — 무한 루프 방지
  if (config.url === '/auth/refresh') {
    return config;
  }

  const exp = getAccessExpiresAt();
  // accessExpiresAt이 설정되어 있고 만료까지 60초 이하면 사전 refresh
  if (exp !== null && Date.now() + PROACTIVE_REFRESH_THRESHOLD_MS >= exp) {
    // 이미 in-flight refresh가 없으면 새로 시작 — 뮤텍스
    if (getRefreshPromise() === null) {
      const promise: Promise<void> = apiClient
        .post<{ user: unknown; accessExpiresAt: number }>('/auth/refresh')
        .then((r) => {
          setAccessExpiresAt(r.data.accessExpiresAt);
        })
        .catch((e: unknown) => {
          // refresh 실패는 호출부(await)에서 catch, 401 fallback이 최종 처리
          throw e;
        })
        .finally(() => {
          // 반드시 null로 해제 — 누락 시 영구 잠금 (ADR 0004 함정)
          setRefreshPromise(null);
        });
      setRefreshPromise(promise);
    }

    try {
      // 동시 요청은 같은 Promise를 await해 refresh 1회만 발생
      await getRefreshPromise();
    } catch {
      // 사전 refresh 실패 — 그대로 원 요청 진행, 401 fallback이 처리
    }
  }

  return config;
});

// 응답 인터셉터 — 401 시 1회 refresh 후 원 요청 재시도 (ADR 0004)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: unknown) => {
    // axios 에러인지 확인
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalConfig = error.config as typeof error.config & {
      _retry?: boolean;
    };

    // 401이고 재시도 이력 없고 refresh 엔드포인트 자체가 아닌 경우에만 fallback 시도
    if (
      error.response?.status === 401 &&
      !originalConfig._retry &&
      originalConfig.url !== '/auth/refresh'
    ) {
      originalConfig._retry = true; // 무한 루프 방지 플래그

      try {
        // fallback refresh 시도
        const r = await apiClient.post<{
          user: unknown;
          accessExpiresAt: number;
        }>('/auth/refresh');
        setAccessExpiresAt(r.data.accessExpiresAt);
        // 원 요청 재시도
        return apiClient(originalConfig);
      } catch {
        // refresh 자체가 실패하면 인증 상태 초기화 후 로그인 페이지로
        clearAuth();
        onAuthFailure?.();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
