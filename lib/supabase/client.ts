import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

const requireBrowserEnv = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const resolveBrowserSupabaseEnv = (): { url: string; anonKey: string } => {
  const target = process.env.NEXT_PUBLIC_SUPABASE_TARGET;

  if (target === 'local') {
    return {
      url: requireBrowserEnv(
        process.env.NEXT_PUBLIC_LOCAL_SUPABASE_URL,
        'NEXT_PUBLIC_LOCAL_SUPABASE_URL'
      ),
      anonKey: requireBrowserEnv(
        process.env.NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY,
        'NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY'
      ),
    };
  }

  if (target === 'remote') {
    return {
      url: requireBrowserEnv(
        process.env.NEXT_PUBLIC_REMOTE_SUPABASE_URL,
        'NEXT_PUBLIC_REMOTE_SUPABASE_URL'
      ),
      anonKey: requireBrowserEnv(
        process.env.NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY,
        'NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY'
      ),
    };
  }

  if (target) {
    throw new Error(`Unsupported Supabase target: ${target}`);
  }

  return {
    url: requireBrowserEnv(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      'NEXT_PUBLIC_SUPABASE_URL'
    ),
    anonKey: requireBrowserEnv(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ),
  };
};

export const createSupabaseBrowserClient = () => {
  const env = resolveBrowserSupabaseEnv();

  return createBrowserClient<Database>(env.url, env.anonKey);
};
