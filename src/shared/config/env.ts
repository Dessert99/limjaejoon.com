/** Supabase 접속 env 해석 — TARGET(local|remote)에 맞는 키 세트를 골라 값으로 변환하는 단일 진입점 */

/** env 조회 대상 — process.env 또는 테스트에서 주입하는 객체 */
type EnvSource = Record<string, string | undefined>;

/** 접속 대상 Supabase — 로컬 도커냐 원격 운영이냐 */
type SupabaseTarget = 'local' | 'remote';

/** target별로 읽어야 할 env '키 이름' 묶음 (값이 아니라 키 자체) */
type SupabaseEnvKeys = {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  postImageBucket: string;
};

/** 브라우저까지 노출돼도 되는 공개 env — url·anon key 만 담는다 */
export type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

/** 누락 시 즉시 throw 하는 fail-fast 조회 — 조용한 undefined 전파를 막는다 */
const requireEnv = (source: EnvSource, key: string): string => {
  const value = source[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

/** TARGET 명시 시 쓰는 대응표 — url·key·버킷을 한 세트로 묶어 로컬/원격 엇갈림을 원천 차단한다 */
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

/** TARGET 미설정(CI·기본 배포 등)일 때 쓰는, prefix 없는 기본 키 세트 */
const activeEnvKeys = {
  url: 'NEXT_PUBLIC_SUPABASE_URL',
  anonKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  serviceRoleKey: 'SUPABASE_SERVICE_ROLE_KEY',
  postImageBucket: 'POST_IMAGE_BUCKET',
} satisfies SupabaseEnvKeys;

/** 문자열이 허용된 target 인지 좁히는 타입 가드 */
const isSupabaseTarget = (value: string): value is SupabaseTarget => {
  return value === 'local' || value === 'remote';
};

/** TARGET 을 읽어 어느 키 세트를 쓸지 고르는 유일한 분기점 — local/remote 선택이 여기 한 곳에 모인다 */
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

/** 클라이언트 생성용 공개 env(url·anon key)를 target 에 맞춰 읽는다 */
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
