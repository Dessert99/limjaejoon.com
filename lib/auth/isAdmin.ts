import type { SessionClaims } from './session';

/** 관리자 판정. 역할은 사용자가 못 고치는 app_metadata에만 있어야 신뢰할 수 있다. */
export const isAdmin = (claims: SessionClaims | null): boolean => {
  return claims?.app_metadata?.role === 'admin';
};
