// 운영자 유저에 app_metadata.role='admin' 을 1회 부여한다 (service role 필요)
import { createClient } from '@supabase/supabase-js';

// src/shared/config/env.ts 의 target 해석 규칙과 동일하게 url/key 를 짝으로 고른다
const targetEnvKeys = {
  local: {
    url: 'NEXT_PUBLIC_LOCAL_SUPABASE_URL',
    serviceRoleKey: 'LOCAL_SUPABASE_SERVICE_ROLE_KEY',
  },
  remote: {
    url: 'NEXT_PUBLIC_REMOTE_SUPABASE_URL',
    serviceRoleKey: 'REMOTE_SUPABASE_SERVICE_ROLE_KEY',
  },
};
const activeEnvKeys = {
  url: 'NEXT_PUBLIC_SUPABASE_URL',
  serviceRoleKey: 'SUPABASE_SERVICE_ROLE_KEY',
};

const target = process.env.NEXT_PUBLIC_SUPABASE_TARGET;
const keys = target ? targetEnvKeys[target] : activeEnvKeys;

if (!keys) {
  throw new Error(`Unsupported Supabase target: ${target}`);
}

const url = process.env[keys.url];
const key = process.env[keys.serviceRoleKey];
const email = process.env.ADMIN_EMAIL;

if (!url || !key || !email) {
  throw new Error(`${keys.url}, ${keys.serviceRoleKey}, ADMIN_EMAIL 필요`);
}

const admin = createClient(url, key);

// email 로 유저를 찾아 app_metadata.role 을 admin 으로 설정
const { data, error } = await admin.auth.admin.listUsers();
if (error) {
  throw error;
}

const user = data.users.find((u) => {
  return u.email === email;
});
if (!user) {
  throw new Error(`유저 없음: ${email} (먼저 계정을 생성하세요)`);
}

const updated = await admin.auth.admin.updateUserById(user.id, {
  app_metadata: { role: 'admin' },
});
if (updated.error) {
  throw updated.error;
}

console.log(`admin role 부여 완료: ${email}`);
