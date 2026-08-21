import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

/** 값이 비면 그 자리에서 끊는다. 주소 없는 클라이언트로 요청이 나가면 원인을 못 찾는다. */
const requireBrowserEnv = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

/** 어느 Supabase를 볼지 고른다. target이 없으면 배포 환경이 꽂아준 기본 키를 쓴다. */
const resolveBrowserSupabaseEnv = (): { url: string; anonKey: string } => {
  // 번들러가 값을 박아 넣으려면 process.env.X를 통째로 적어야 한다. 변수로 빼면 undefined가 된다
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

  // 오타 난 target을 조용히 무시하면 로컬을 본다고 믿고 운영 DB를 건드린다
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

/** 브라우저용 Supabase 클라이언트. 세션을 쿠키에 두어 서버와 같은 로그인을 본다. */
export const createSupabaseBrowserClient = () => {
  const env = resolveBrowserSupabaseEnv();

  return createBrowserClient<Database>(env.url, env.anonKey);
};
