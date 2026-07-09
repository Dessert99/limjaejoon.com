/** 서버 전용 Supabase admin client — service role key로 RLS를 우회한다 */
import { createClient } from '@supabase/supabase-js';
import { readServerEnv } from '@/shared/config';
import type { Database } from './database.types';

/** admin write/upload Route Handler 에서 service role client 를 생성한다 */
export const createSupabaseAdminClient = () => {
  const env = readServerEnv();

  return createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey);
};
