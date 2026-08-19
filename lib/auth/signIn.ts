import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export const signIn = async (input: {
  email: string;
  password: string;
}): Promise<{ error: string | null }> => {
  const client = createSupabaseBrowserClient();
  const { error } = await client.auth.signInWithPassword(input);

  return { error: error ? error.message : null };
};
