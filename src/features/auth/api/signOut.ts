/** auth feature 의 로그아웃 액션 — 세션 쿠키를 폐기한다 */
import { createSupabaseBrowserClient } from '@/shared/api';

/** 현재 세션을 종료한다 */
export const signOut = async (): Promise<void> => {
  const client = createSupabaseBrowserClient();
  await client.auth.signOut();
};
