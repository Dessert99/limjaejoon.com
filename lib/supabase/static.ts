/** 정적 렌더링에서 사용하는 쿠키 비의존 Supabase client */
import { createClient } from '@supabase/supabase-js';
import { readPublicEnv } from '@/config/env';
import type { Database } from './database.types';

/** 빌드·정적 렌더링용 Supabase client 를 생성한다 */
export const createSupabaseStaticClient = () => {
  const env = readPublicEnv();

  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
};
