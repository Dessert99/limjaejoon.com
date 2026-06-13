type EnvSource = Record<string, string | undefined>;

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

export const readPublicEnv = (source: EnvSource = process.env): PublicEnv => {
  return {
    supabaseUrl: requireEnv(source, 'NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: requireEnv(source, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  };
};

export const readServerEnv = (source: EnvSource = process.env): ServerEnv => {
  return {
    ...readPublicEnv(source),
    supabaseServiceRoleKey: requireEnv(source, 'SUPABASE_SERVICE_ROLE_KEY'),
  };
};
