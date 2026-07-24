/** 세션 엔티티의 claim 조회 — 서명 검증된 JWT claim 만 인가 판단 근거로 노출한다 */
import type { SupabaseClient } from '@supabase/supabase-js';

/** 인가 판단에 필요한 최소 claim — RLS 가 읽는 app_metadata.role 을 포함한다 */
export type SessionClaims = {
  sub: string;
  email?: string;
  app_metadata?: { role?: string };
};

/** getClaims() 로 서명 검증된 claim 을 읽는다 (getSession() 은 위조 가능해 쓰지 않음) */
export const getSessionClaims = async (
  client: SupabaseClient
): Promise<SessionClaims | null> => {
  const { data, error } = await client.auth.getClaims();

  // 검증 실패·미로그인은 인가 거부와 동일하게 null 로 좁힌다
  if (error || !data?.claims) {
    return null;
  }

  const claims = data.claims;

  return {
    sub: claims.sub,
    email: claims.email,
    app_metadata: claims.app_metadata?.role
      ? { role: claims.app_metadata.role }
      : undefined,
  };
};
