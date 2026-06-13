import { readPublicEnv } from '@/shared/config';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

export const createSupabaseBrowserClient = () => {
  const env = readPublicEnv();

  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
};
