/** 세션 claim 에서 운영자 여부를 판정한다 — RLS 정책과 같은 기준(app_metadata.role) */
import type { SessionClaims } from '../api/getSessionClaims';

/** app_metadata.role 이 admin 인 검증된 claim 만 운영자로 인정한다 */
export const isAdmin = (claims: SessionClaims | null): boolean => {
  return claims?.app_metadata?.role === 'admin';
};
