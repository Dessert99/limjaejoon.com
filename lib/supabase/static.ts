import { createClient } from '@supabase/supabase-js';
import { readPublicEnv } from '@/config/env';
import type { Database } from './database.types';

/** 빌드 때 쓰는 Supabase 클라이언트. 쿠키가 없어 익명 권한으로만 공개 글을 읽는다. */
export const createSupabaseStaticClient = () => {
  const env = readPublicEnv();

  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
};
