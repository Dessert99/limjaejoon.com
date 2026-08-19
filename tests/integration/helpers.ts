import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

const loadEnvLocal = (): void => {
  const envFilePath = path.resolve(process.cwd(), '.env.local');

  if (!fs.existsSync(envFilePath)) {
    return;
  }

  const lines = fs.readFileSync(envFilePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1).replace(/^['"]|['"]$/g, '');

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

loadEnvLocal();

const requireEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const supabaseUrl = requireEnv('NEXT_PUBLIC_LOCAL_SUPABASE_URL');
const supabaseAnonKey = requireEnv('NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY');
const supabaseServiceRoleKey = requireEnv('LOCAL_SUPABASE_SERVICE_ROLE_KEY');

export const createServiceRoleClient = (): SupabaseClient<Database> => {
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
};

export const createAnonClient = (): SupabaseClient<Database> => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

export type TestUserRole = 'admin' | 'member';

export type TestUser = {
  id: string;
  email: string;
  password: string;
};

export const createTestUser = async (role: TestUserRole): Promise<TestUser> => {
  const email = `integration-${role}-${randomUUID()}@example.com`;
  const password = 'Test-password-123!';
  const appMetadata = role === 'admin' ? { role: 'admin' } : {};

  const { data, error } = await createServiceRoleClient().auth.admin.createUser(
    {
      email,
      password,
      email_confirm: true,
      app_metadata: appMetadata,
    }
  );

  if (error || !data.user) {
    throw error ?? new Error('테스트 유저 생성 실패');
  }

  return { id: data.user.id, email, password };
};

export const signInTestUser = async (
  user: TestUser
): Promise<SupabaseClient<Database>> => {
  const client = createAnonClient();
  const { error } = await client.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });

  if (error) {
    throw error;
  }

  return client;
};

export const deleteTestUser = async (userId: string): Promise<void> => {
  await createServiceRoleClient().auth.admin.deleteUser(userId);
};
