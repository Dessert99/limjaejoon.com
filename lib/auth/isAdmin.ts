import type { SessionClaims } from './session';

export const isAdmin = (claims: SessionClaims | null): boolean => {
  return claims?.app_metadata?.role === 'admin';
};
