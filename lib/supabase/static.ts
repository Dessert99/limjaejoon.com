import { createClient } from '@supabase/supabase-js';
import { readPublicEnv } from '@/config/env';
import type { Database } from './database.types';

export const createSupabaseStaticClient = () => {
  const env = readPublicEnv();

  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
};
