/** auth feature 의 로그인 액션 — browser client 로 세션 쿠키를 발급받는다 */
// barrel(@/shared/api) 대신 client 모듈을 직접 import — 서버 전용 코드(next/headers)가 클라 번들에 섞이는 것을 막는다
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/** 이메일/비밀번호 로그인 — 성공 시 error null, 실패 시 메시지를 반환한다 */
export const signIn = async (input: {
  email: string;
  password: string;
}): Promise<{ error: string | null }> => {
  const client = createSupabaseBrowserClient();
  const { error } = await client.auth.signInWithPassword(input);

  return { error: error ? error.message : null };
};
