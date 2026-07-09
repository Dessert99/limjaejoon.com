type EnvSource = Record<string, string | undefined>;
type SupabaseTarget = 'local' | 'remote';
type SupabaseEnvKeys = {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
};

export type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export type ServerEnv = PublicEnv & {
  supabaseServiceRoleKey: string;
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
  },
  remote: {
    url: 'NEXT_PUBLIC_REMOTE_SUPABASE_URL',
    anonKey: 'NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY',
    serviceRoleKey: 'REMOTE_SUPABASE_SERVICE_ROLE_KEY',
  },
} satisfies Record<SupabaseTarget, SupabaseEnvKeys>;

const activeEnvKeys = {
  url: 'NEXT_PUBLIC_SUPABASE_URL',
  anonKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  serviceRoleKey: 'SUPABASE_SERVICE_ROLE_KEY',
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

export const readServerEnv = (source: EnvSource = process.env): ServerEnv => {
  const keys = resolveSupabaseEnvKeys(source);

  return {
    ...readPublicEnv(source),
    supabaseServiceRoleKey: requireEnv(source, keys.serviceRoleKey),
  };
};
