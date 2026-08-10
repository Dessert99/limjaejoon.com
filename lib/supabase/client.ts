/** browser 전용 Supabase client — literal NEXT_PUBLIC_* 참조로 클라 번들 인라인을 보장한다 */
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

/** env.ts requireEnv 와 동일한 fail-fast 포맷 — 누락 시 즉시 throw */
const requireBrowserEnv = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

// source[key] 동적 접근은 빌드타임 문자열 치환 대상이 아니라 브라우저에서 undefined가 된다 — target별로 literal process.env.NEXT_PUBLIC_* 를 그대로 나열
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

/** 이메일/비밀번호 로그인 등 client-side auth 용 Supabase browser client 를 생성한다 */
export const createSupabaseBrowserClient = () => {
  const env = resolveBrowserSupabaseEnv();

  return createBrowserClient<Database>(env.url, env.anonKey);
};
