/** 로컬 Supabase 통합 테스트 공용 client·유저 팩토리 — anon/non-admin/admin 세 주체를 만든다 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

// vitest 는 .env.local 을 자동 로드하지 않으므로 helpers 임포트 시점에 직접 채운다
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

    // 실제 환경변수(CI 등)가 이미 있으면 덮어쓰지 않는다
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

loadEnvLocal();

/** 필수 env 누락 시 즉시 throw — 로컬 Supabase 미기동 상태로 조용히 진행되지 않게 */
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

/** RLS 를 우회하는 service role client — 테스트 유저 생성·삭제 전용 */
export const createServiceRoleClient = (): SupabaseClient<Database> => {
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
};

/** 세션 없는 anon client — 비로그인 사용자 시나리오 검증용 */
export const createAnonClient = (): SupabaseClient<Database> => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

/** 생성 대상 테스트 유저 역할 — admin 만 app_metadata.role 이 admin */
export type TestUserRole = 'admin' | 'member';

/** 생성된 테스트 유저의 로그인 정보 */
export type TestUser = {
  id: string;
  email: string;
  password: string;
};

/** confirmed 테스트 유저 생성 — role='admin' 이면 app_metadata.role 을 admin 으로 세팅해 RLS admin 분기를 태운다 */
export const createTestUser = async (role: TestUserRole): Promise<TestUser> => {
  // 통합 테스트 파일이 병렬 실행되므로 Date.now() 만으로는 밀리초가 겹칠 수 있어 randomUUID 로 유일화
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

/** 유저로 로그인한 세션 client 반환 — RLS 는 세션 JWT 의 app_metadata claim 을 기준으로 평가한다 */
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

/** 테스트 유저 삭제 — afterAll 정리용 */
export const deleteTestUser = async (userId: string): Promise<void> => {
  await createServiceRoleClient().auth.admin.deleteUser(userId);
};
