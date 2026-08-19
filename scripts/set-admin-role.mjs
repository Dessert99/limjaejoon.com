import { createClient } from '@supabase/supabase-js';

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
