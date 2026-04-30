// access 토큰 만료 시각(epoch ms)과 refresh 뮤텍스를 모듈 스코프에서 관리한다 (ADR 0004)
// axios client는 브라우저 번들 전용이므로 SSR 인스턴스 공유 위험 없음

// access 토큰 만료 시각 — 서버 응답 accessExpiresAt으로 갱신
let accessExpiresAt: number | null = null;

// refresh 요청이 in-flight일 때 동시 요청이 공유하는 Promise (뮤텍스)
let refreshPromise: Promise<void> | null = null;

// 만료 시각을 갱신한다 — login/signup/refresh 성공 후 호출
export const setAccessExpiresAt = (v: number): void => {
  accessExpiresAt = v;
};

// 현재 저장된 만료 시각을 반환한다 — 사전 refresh 판단에 사용
export const getAccessExpiresAt = (): number | null => accessExpiresAt;

// 현재 in-flight refresh Promise를 설정한다 — 동시 요청 뮤텍스
export const setRefreshPromise = (p: Promise<void> | null): void => {
  refreshPromise = p;
};

// 현재 in-flight refresh Promise를 반환한다 — 동시 요청이 대기에 사용
export const getRefreshPromise = (): Promise<void> | null => refreshPromise;

// 인증 상태를 전부 초기화한다 — 로그아웃 또는 인증 실패 시 호출
export const clearAuth = (): void => {
  accessExpiresAt = null;
  refreshPromise = null;
};
