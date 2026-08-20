import type { SupabaseClient } from '@supabase/supabase-js';

/** 토큰에서 뽑아 쓰는 최소 정보. 역할은 app_metadata에 있는 것만 인정한다. */
export type SessionClaims = {
  sub: string;
  email?: string;
  app_metadata?: { role?: string };
};

/** 세션 토큰의 클레임을 읽는다. 로그인 안 했거나 토큰이 깨졌으면 null이다. */
export const getSessionClaims = async (
  client: SupabaseClient
): Promise<SessionClaims | null> => {
  // getClaims는 서명을 로컬에서 검증해서, 요청마다 인증 서버를 왕복하지 않는다
  const { data, error } = await client.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  const claims = data.claims;

  return {
    sub: claims.sub,
    email: claims.email,
    // 역할만 뽑아 담아, 토큰에 뭐가 더 실려 있든 판정에 새어 들어오지 않게 한다
    app_metadata: claims.app_metadata?.role
      ? { role: claims.app_metadata.role }
      : undefined,
  };
};
