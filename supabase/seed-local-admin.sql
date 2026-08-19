delete from auth.users where email = 'qwer1234@naver.com';

do $$
declare
  admin_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    created_at, updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000',
    admin_id, 'authenticated', 'authenticated',
    'qwer1234@naver.com',
    crypt('qwer1234!@#', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin"}',
    '{}',
    '', '', '', '',
    now(), now()
  );

  insert into auth.identities (
    id, provider_id, user_id, identity_data, provider, created_at, updated_at
  ) values (
    gen_random_uuid(), admin_id::text, admin_id,
    jsonb_build_object('sub', admin_id::text, 'email', 'qwer1234@naver.com'),
    'email', now(), now()
  );
end $$;
