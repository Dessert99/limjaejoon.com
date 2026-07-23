type EnvSource = Record<string, string | undefined>;
type SupabaseTarget = 'local' | 'remote';
type SupabaseEnvKeys = {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  postImageBucket: string;
};

export type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

const requireEnv = (source: EnvSource, key: string): string => {
  const value = source[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const targetEnvKeys = {
  local: {
    url: 'NEXT_PUBLIC_LOCAL_SUPABASE_URL',
    anonKey: 'NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY',
    serviceRoleKey: 'LOCAL_SUPABASE_SERVICE_ROLE_KEY',
    postImageBucket: 'LOCAL_POST_IMAGE_BUCKET',
  },
  remote: {
    url: 'NEXT_PUBLIC_REMOTE_SUPABASE_URL',
    anonKey: 'NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY',
    serviceRoleKey: 'REMOTE_SUPABASE_SERVICE_ROLE_KEY',
    postImageBucket: 'REMOTE_POST_IMAGE_BUCKET',
  },
} satisfies Record<SupabaseTarget, SupabaseEnvKeys>;

const activeEnvKeys = {
  url: 'NEXT_PUBLIC_SUPABASE_URL',
  anonKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  serviceRoleKey: 'SUPABASE_SERVICE_ROLE_KEY',
  postImageBucket: 'POST_IMAGE_BUCKET',
} satisfies SupabaseEnvKeys;

const isSupabaseTarget = (value: string): value is SupabaseTarget => {
  return value === 'local' || value === 'remote';
};

const resolveSupabaseEnvKeys = (source: EnvSource): SupabaseEnvKeys => {
  const target = source.NEXT_PUBLIC_SUPABASE_TARGET;

  if (!target) {
    return activeEnvKeys;
  }

  if (!isSupabaseTarget(target)) {
    throw new Error(`Unsupported Supabase target: ${target}`);
  }

  return targetEnvKeys[target];
};

export const readPublicEnv = (source: EnvSource = process.env): PublicEnv => {
  const keys = resolveSupabaseEnvKeys(source);

  return {
    supabaseUrl: requireEnv(source, keys.url),
    supabaseAnonKey: requireEnv(source, keys.anonKey),
  };
};

/** post 이미지 버킷명만 읽는다 — 업로드 라우트는 세션 클라이언트를 쓰므로 service role key·ADMIN_EMAIL 이 불필요하다 */
export const readPostImageBucket = (
  source: EnvSource = process.env
): string => {
  const keys = resolveSupabaseEnvKeys(source);

  return requireEnv(source, keys.postImageBucket);
};
