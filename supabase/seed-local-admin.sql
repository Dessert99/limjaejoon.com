-- 로컬 전용 어드민 계정 부트스트랩 — `npm run auth:seed-admin-local` 로 로컬 도커 컨테이너에만 적용한다.
-- config.toml 의 seed 경로에 넣지 않는다: `db reset`·`db push --include-seed`·`db reset --linked` 어디에도
-- 딸려가지 않아 원격 실행이 구조적으로 불가능하다. 평문 비밀번호는 로컬 개발 전용이며 원격엔 절대 쓰지 않는다.
delete from auth.users where email = 'qwer1234@naver.com';

do $$
declare
  admin_id uuid := gen_random_uuid();
begin
  -- app_metadata.role='admin' 을 처음부터 심어 별도 role 부여 없이 RLS admin 분기를 태운다
  -- confirmation_token 등 토큰 컬럼은 default 가 없어 NULL 이면 GoTrue 가 문자열 스캔 중 죽는다 — '' 로 채운다
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

  -- signInWithPassword 는 email provider identity 레코드를 요구한다
  insert into auth.identities (
    id, provider_id, user_id, identity_data, provider, created_at, updated_at
  ) values (
    gen_random_uuid(), admin_id::text, admin_id,
    jsonb_build_object('sub', admin_id::text, 'email', 'qwer1234@naver.com'),
    'email', now(), now()
  );
end $$;
