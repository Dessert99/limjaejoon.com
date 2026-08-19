import type { SupabaseClient } from '@supabase/supabase-js';

export type SessionClaims = {
  sub: string;
  email?: string;
  app_metadata?: { role?: string };
};

export const getSessionClaims = async (
  client: SupabaseClient
): Promise<SessionClaims | null> => {
  const { data, error } = await client.auth.getClaims();

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
