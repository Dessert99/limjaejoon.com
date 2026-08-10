/** auth feature 의 로그아웃 액션 — 세션 쿠키를 폐기한다 */
// barrel(@/shared/api) 대신 client 모듈을 직접 import — 서버 전용 코드(next/headers)가 클라 번들에 섞이는 것을 막는다
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/** 현재 세션을 종료한다 */
export const signOut = async (): Promise<void> => {
  const client = createSupabaseBrowserClient();
  await client.auth.signOut();
};
