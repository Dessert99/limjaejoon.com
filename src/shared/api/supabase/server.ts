import { readPublicEnv } from '@/shared/config';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

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
          // Server Component 에서 호출되면 cookies().set() 이 throw 하는데, 세션 갱신은 proxy(proxy.ts)가 맡으므로 여기선 무시한다
        }
      },
    },
  });
};
