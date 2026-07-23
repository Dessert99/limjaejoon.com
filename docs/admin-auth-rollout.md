# 어드민 인증 롤아웃 체크리스트

Supabase Auth + RLS 기반 어드민 인증을 로컬/원격에 적용할 때의 운영 절차. 설계 근거는 [스펙](superpowers/specs/2026-07-23-admin-auth-design.md), 구현은 [계획](superpowers/plans/2026-07-24-admin-auth.md) 참고.

## 로컬 (.env.local)

- [ ] `LOCAL_POST_IMAGE_BUCKET=post-images` 로 맞춘다. (버킷명을 로컬/원격 `post-images` 로 통일했다. `.env.local` 은 수동 관리라 `post-images-local` 로 남아 있을 수 있다.)
- [ ] `ADMIN_EMAIL=` 에 운영자 이메일을 넣는다.
- [ ] `supabase db reset` 로 posts RLS·storage 정책·`post-images` 버킷이 로컬에 적용됐는지 확인한다.
- [ ] 통합 테스트로 보안 경계를 확인한다: `npm run test:integration` (로컬 Supabase 필요).

## 운영자 계정 (순서 중요)

`app_metadata.role` 은 이미 발급된 JWT 에 즉시 반영되지 않으므로 **계정 생성 → role 부여 → 최초 로그인** 순서를 지킨다.

- [ ] 1. Supabase 대시보드/CLI 로 운영자 계정을 만든다. 비밀번호는 **길고 무작위**로.
- [ ] 2. `npm run auth:set-admin` 으로 `app_metadata.role='admin'` 을 부여한다. (스크립트는 `--env-file=.env.local` 로 env 를 읽고, `NEXT_PUBLIC_SUPABASE_TARGET` 에 따라 local/remote 프로필을 쌍으로 해석한다. 원격 대상이면 target=remote + REMOTE_* 키가 필요하다.)
- [ ] 3. `/admin/login` 에서 최초 로그인한다.
- [ ] 이미 로그인한 상태에서 role 을 바꿨다면 재로그인(또는 refreshSession)한다. role **회수** 시엔 전역 sign-out 으로 refresh token 까지 폐기한다.

## 원격 마이그레이션

- [ ] `supabase db push --dry-run` 으로 posts/storage 정책 마이그레이션만 신규로 잡히는지 확인한다.
- [ ] `supabase db push` 로 적용한다.
- [ ] 원격에 `post-images` 버킷이 **public** 으로, `file_size_limit`·`allowed_mime_types`(image/jpeg,png,webp,avif) 와 함께 존재하는지 확인한다. (`config.toml` 의 버킷 설정은 로컬용이다. 원격은 대시보드에서 확인·생성.)

## 원격 Supabase Auth 설정

- [ ] "Allow new users to sign up" **비활성화** (anon key 로 signup API 직접 호출 가능).
- [ ] anonymous sign-in **비활성화**.
- [ ] 유출 비밀번호 차단(HaveIBeenPwned) **활성화**.
- [ ] Auth rate limit 확인.

## 프로덕션 확인

- [ ] 세션 쿠키가 `SameSite=Lax`, `Secure` 인지 확인한다.
- [ ] 리버스 프록시 뒤라면 `x-forwarded-host` 가 올바르게 전달되는지 확인한다. (어드민 mutation 의 Origin 검사가 이 헤더를 신뢰한다.)
- [ ] 스모크 테스트: `/admin/login` 로그인 → 글 작성/수정 → 이미지 업로드 성공. 비로그인은 `/admin/login` 으로, 로그인했지만 비admin 은 403 화면.

## 후속(옵션)

- TOTP MFA + RLS `aal2` 조건.
- draft 이미지 비공개화(private bucket / signed URL).
- 삭제 기능 도입 시 posts DELETE grant/정책.
