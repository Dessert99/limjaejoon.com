import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { readPublicEnv, readServiceRoleKey } from '@/lib/env';
import type { Database } from './database.types';

/** 공개 글을 서버에서 읽는 Supabase 클라이언트. anon이 테이블을 못 읽으므로 RLS를 건너뛰는 service role 키로 읽는다. */
export const createSupabaseStaticClient = () => {
  const env = readPublicEnv();

  return createClient<Database>(env.supabaseUrl, readServiceRoleKey());
};
