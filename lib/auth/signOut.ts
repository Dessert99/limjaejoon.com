import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export const signOut = async (): Promise<void> => {
  const client = createSupabaseBrowserClient();
  await client.auth.signOut();
};
