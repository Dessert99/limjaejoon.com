'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

/** 이메일·비밀번호 로그인. 서버에서 세션 쿠키를 심고, 실패해도 던지지 않고 화면이 보여줄 메시지를 돌려준다. */
export const signIn = async (input: {
  email: string;
  password: string;
}): Promise<{ error: string | null }> => {
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.signInWithPassword(input);

  return { error: error ? error.message : null };
};
