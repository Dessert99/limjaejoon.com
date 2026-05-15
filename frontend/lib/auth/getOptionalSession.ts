// 공개 페이지(SiteHeader 등)에서 "있으면 user, 없으면 null" 형태로 세션을 조회하는 RSC 헬퍼
// verifySession과 달리 실패 시 redirect하지 않고 null을 반환 — 비로그인도 정상 흐름인 페이지 전용
// React.cache()로 같은 요청 내 중복 호출 dedup (ADR 0005)
import { cache } from 'react';

import { cookies } from 'next/headers';

import { API_BASE_URL } from '@/lib/base-url';
import type { SessionUser } from './verifySession';

/**
 * 현재 요청의 세션을 "옵셔널"하게 조회한다.
 * - access_token 쿠키가 없으면 백엔드 호출 없이 null
 * - 백엔드 401/5xx/네트워크 오류면 모두 null (공개 페이지 렌더가 깨지면 안 됨)
 * - 200이면 SessionUser 반환
 */
export const getOptionalSession = cache(
  async (): Promise<SessionUser | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    // 토큰 부재 — 비로그인 상태로 즉시 종료
    if (!accessToken?.value) {
      return null;
    }

    // 백엔드 /auth/me 호출 — 만료/위조된 쿠키도 여기서 걸러냄
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          cookie: `access_token=${accessToken.value}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        // 401(만료된 좀비 쿠키)·5xx 등 모두 비로그인으로 graceful degrade
        return null;
      }

      const user = (await response.json()) as SessionUser;
      return user;
    } catch {
      // 네트워크 단절·백엔드 다운 시에도 공개 페이지가 500으로 깨지지 않도록 null fallback
      return null;
    }
  }
);
