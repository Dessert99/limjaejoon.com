// Server Component 전용 인증 검증 헬퍼 — React.cache()로 요청 단위 dedup (ADR 0005)
// 반드시 Server Component에서만 호출할 것. 클라이언트 번들에 포함되면 안 됨.
import { cache } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { API_BASE_URL } from '@/lib/base-url';

// 백엔드 /auth/me 응답 형태 (백엔드 PublicUser 기준)
export interface SessionUser {
  id: string;
  email: string;
  createdAt: string;
}

/**
 * 현재 요청의 세션을 검증하고 User를 반환한다.
 * access_token 쿠키가 없거나 /auth/me가 401이면 /login?returnTo=...으로 redirect한다.
 * React.cache()로 같은 요청 내 중복 호출을 dedup한다.
 *
 * @param currentPath redirect 시 returnTo 쿼리스트링에 담을 현재 경로
 */
export const verifySession = cache(
  async (currentPath: string): Promise<SessionUser> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    // 쿠키 부재 시 즉시 redirect — 백엔드 호출 불필요
    if (!accessToken?.value) {
      redirect(`/login?returnTo=${encodeURIComponent(currentPath)}`);
    }

    // access_token 쿠키를 Cookie 헤더로 전달해 백엔드 /auth/me 호출
    // cache: 'no-store' 필수 — 캐시 시 다른 사용자에게 같은 결과 반환 위험
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        // httpOnly 쿠키를 서버 측에서 수동 전달 — withCredentials는 브라우저 전용
        cookie: `access_token=${accessToken.value}`,
      },
      cache: 'no-store',
    });

    // 401/기타 실패 시 /login으로 redirect — 클라이언트 측 apiClient 인터셉터가 후속 refresh 처리
    if (!response.ok) {
      redirect(`/login?returnTo=${encodeURIComponent(currentPath)}`);
    }

    // 검증 성공 — User 반환
    const user = (await response.json()) as SessionUser;
    return user;
  }
);
