type EnvSource = Record<string, string | undefined>;

type SupabaseEnvKeys = {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  postImageBucket: string;
};

/** 서버가 쓰는 Supabase 접속 정보. 브라우저 코드는 Supabase에 직접 붙지 않는다. */
export type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

/** 값이 비면 그 자리에서 끊는다. 주소 없는 클라이언트로 요청이 나가면 원인을 못 찾는다. */
const requireEnv = (source: EnvSource, key: string): string => {
  const value = source[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

/** 어느 Supabase를 볼지에 따라 읽을 키 이름을 고른다. */
const resolveSupabaseEnvKeys = (source: EnvSource): SupabaseEnvKeys => {
  const target = source.NEXT_PUBLIC_SUPABASE_TARGET;

  // target을 안 정하면 배포 환경이 꽂아준 이름을 그대로 읽는다
  if (!target) {
    return {
      url: 'NEXT_PUBLIC_SUPABASE_URL',
      anonKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      serviceRoleKey: 'SUPABASE_SERVICE_ROLE_KEY',
      postImageBucket: 'POST_IMAGE_BUCKET',
    };
  }

  if (target === 'local') {
    return {
      url: 'NEXT_PUBLIC_LOCAL_SUPABASE_URL',
      anonKey: 'NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY',
      serviceRoleKey: 'LOCAL_SUPABASE_SERVICE_ROLE_KEY',
      postImageBucket: 'LOCAL_POST_IMAGE_BUCKET',
    };
  }

  if (target === 'remote') {
    return {
      url: 'NEXT_PUBLIC_REMOTE_SUPABASE_URL',
      anonKey: 'NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY',
      serviceRoleKey: 'REMOTE_SUPABASE_SERVICE_ROLE_KEY',
      postImageBucket: 'REMOTE_POST_IMAGE_BUCKET',
    };
  }

  // 오타 난 target을 조용히 무시하면 로컬을 본다고 믿고 운영 DB를 건드린다
  throw new Error(`Unsupported Supabase target: ${target}`);
};

/** 서버가 사용자 세션으로 붙을 때 쓰는 접속 정보. anon 키라 RLS가 실제 권한을 정한다. */
export const readPublicEnv = (source: EnvSource = process.env): PublicEnv => {
  const keys = resolveSupabaseEnvKeys(source);

  return {
    supabaseUrl: requireEnv(source, keys.url),
    supabaseAnonKey: requireEnv(source, keys.anonKey),
  };
};

/** RLS를 건너뛰는 service role 키. 새면 DB 전체가 열리므로 서버 코드만 읽는다. */
export const readServiceRoleKey = (source: EnvSource = process.env): string => {
  const keys = resolveSupabaseEnvKeys(source);

  return requireEnv(source, keys.serviceRoleKey);
};

/** 본문 이미지를 올릴 스토리지 버킷 이름. */
export const readPostImageBucket = (
  source: EnvSource = process.env
): string => {
  const keys = resolveSupabaseEnvKeys(source);

  return requireEnv(source, keys.postImageBucket);
};
