import { createSupabaseBrowserClient } from '@/lib/supabase/client';

/** 로그아웃. 세션 쿠키가 지워져 서버 쪽 권한도 같이 떨어진다. */
export const signOut = async (): Promise<void> => {
  const client = createSupabaseBrowserClient();
  await client.auth.signOut();
};
