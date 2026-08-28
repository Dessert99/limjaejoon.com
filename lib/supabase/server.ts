import { readPublicEnv } from '@/config/env';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

/** 서버용 Supabase 클라이언트. 요청 쿠키에서 세션을 읽어 그 사용자 권한으로 질의한다. */
export const createSupabaseServerClient = async () => {
  const env = readPublicEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component는 쿠키를 못 써서 던진다. 갱신은 프록시와 라우트 핸들러가 맡으므로 흘려보낸다
        }
      },
    },
  });
};
