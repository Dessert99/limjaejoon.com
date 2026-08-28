import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/** 이메일·비밀번호 로그인. 실패해도 던지지 않고 화면이 보여줄 메시지를 돌려준다. */
export const signIn = async (input: {
  email: string;
  password: string;
}): Promise<{ error: string | null }> => {
  const client = createSupabaseBrowserClient();
  const { error } = await client.auth.signInWithPassword(input);

  return { error: error ? error.message : null };
};
