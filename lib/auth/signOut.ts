'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

/** 로그아웃. 서버에서 세션 쿠키를 지워 서버 쪽 권한도 같이 떨어진다. */
export const signOut = async (): Promise<void> => {
  const client = await createSupabaseServerClient();
  await client.auth.signOut();
};
