# Admin Auth Design

Blog Platform Phase 1에서 제외했던 "Supabase Auth 로그인"을 도입해, 어드민 화면과 쓰기 경로에 진짜 인증/인가를 붙인다. 이 문서는 Codex 설계 리뷰(21건)를 반영한 확정본이다.

## 목표

어드민(글쓰기) 화면과 쓰기 API를 "공유 토큰 붙여넣기"에서 **Supabase Auth 로그인 + RLS 기반 인가**로 전환한다.

완료 기준은 다음 문장으로 잡는다.

> 운영자만 로그인해 `/admin`에 진입하고, 로그인한 운영자만 글/이미지를 쓸 수 있으며, 그 권한을 Postgres RLS가 DB단에서 최종 집행하고, service role 키는 사용자 요청 경로에서 완전히 제거된 상태.

## 범위

포함한다.

- Supabase Auth 이메일+비밀번호 로그인과 로그아웃.
- 운영자 식별용 `app_metadata.role='admin'` 커스텀 클레임과 부여 스크립트.
- `posts` 테이블 admin write RLS 정책(작업별 SELECT/INSERT/UPDATE)과 authenticated grant.
- Storage `post-images` bucket의 admin write/read RLS 정책과 파일 제약.
- 세션 기반 admin Route Handler(service role → 세션 클라이언트 전환)와 에러→HTTP 매핑.
- `proxy.ts`(Next 16) 세션 갱신과 optimistic redirect.
- route group 기반 공개/보호 구역 분리와 서버 레이아웃 보조 가드.
- 로그인 화면과 로그아웃 액션.
- 기존 `ADMIN_POST_TOKEN` 공유 토큰 메커니즘 제거.
- 로컬 Supabase 대상 RLS/Storage 통합 테스트.

제외한다.

- 공개 회원가입 UI와 다중 사용자.
- TOTP MFA와 `aal2` 강제(후속 옵션).
- 비밀번호 재설정/이메일 인증 플로우.
- 삭제 기능과 그에 따른 DELETE grant/정책.
- 소셜 로그인(GitHub OAuth 등).
- draft 이미지 비공개화(private bucket/signed URL).

## 확정 결정

명확화 질문과 Codex 리뷰를 거쳐 다음을 확정한다.

- 인증은 **Supabase Auth 이메일+비밀번호**. 운영자는 1명, 공개 가입 없음.
- 인가는 **RLS로 DB단 집행**. service role 우회 대신 사용자 세션 클라이언트를 쓴다.
- 운영자 식별은 **`app_metadata.role='admin'`** 커스텀 클레임.
- admin 인가 로직은 **`entities/session`** 슬라이스에 둔다. `shared`는 도메인 비의존을 유지한다.
- RLS/Storage 보안 경계는 **로컬 Supabase 통합 테스트**로 검증한다.
- 하드닝은 **값싼 config**(유출 비밀번호 차단, rate limit 확인, 강한 비밀번호)까지. MFA는 보류.
- draft 이미지의 발행 전 노출 가능성은 **명시적으로 수용**한다(public bucket, YAGNI).

## 인증 흐름

기본 흐름은 다음과 같다.

- 비로그인 상태로 `/admin/*` 접근 → `proxy.ts`가 세션 없음을 보고 `/admin/login`으로 optimistic redirect.
- `/admin/login`에서 `signInWithPassword(email, pw)` → Supabase Auth가 access/refresh 토큰을 발급하고 `@supabase/ssr`이 쿠키에 저장 → `/admin/posts`로 이동.
- 로그인 상태로 `/admin/*` 접근 → `proxy.ts`가 세션 쿠키를 갱신하고, 보호 레이아웃이 `getClaims()`로 role을 재확인한다.
- 글 저장/이미지 업로드 → Route Handler가 세션 클라이언트로 DB/Storage에 접근하고, RLS가 admin claim을 최종 검사한다.
- 로그인했지만 admin이 아닌 경우 → 보호 레이아웃이 **최소 403 화면**을 보여준다. 서버 컴포넌트에서 쿠키 삭제/`signOut`이 불가능하므로 "로그아웃 후 redirect"는 하지 않는다.

## 라우팅과 방어 계층

인증은 한 곳이 아니라 여러 겹으로 나눈다. 각 계층의 역할을 분리한다.

- `proxy.ts`(루트): 세션 쿠키 갱신과 비로그인 optimistic redirect만 담당한다. 최종 경계가 아니다.
- 보호 레이아웃(서버 컴포넌트): role 확인 보조 가드. 매 탐색마다 재실행이 보장되지 않으므로 보조 방어선으로만 취급한다.
- Route Handler: mutation의 실제 재검증 지점. 세션 검증과 Origin 검사를 여기서 한다.
- RLS(DB): 최종 경계. 앞 계층이 모두 뚫려도 여기서 막는다.

route group으로 공개/보호 구역을 분리해 리다이렉트 루프를 막는다. 괄호 group은 URL에 나타나지 않으므로 기존 경로가 유지된다.

```text
app/admin/(public)/login/page.tsx      # 가드 없는 공개 구역, @/pages/admin-login re-export
app/admin/(protected)/layout.tsx       # getClaims() role 확인, 비admin 403
app/admin/(protected)/posts/...        # 기존 /admin/posts, /new, /[id] 이동
proxy.ts                               # 루트, export function proxy() (Next 16 개명)
```

Next.js 16에서 `middleware.ts`는 deprecated되고 `proxy.ts`/`proxy` export로 개명됐다. 신규 파일은 `proxy.ts`로 만든다.

`proxy.ts`는 세션을 갱신한 쿠키를 `next()`와 모든 redirect 응답에 명시적으로 복사한다. 갱신 후 새 `NextResponse.redirect()`를 만들면서 `Set-Cookie`를 잃지 않게 한다.

기존 `createSupabaseServerClient`는 `next/headers`의 `cookies()` 기반이라 Server Component/Route Handler 전용이다. `proxy.ts`는 request/response 객체로 쿠키를 읽고 쓰는 별도 클라이언트가 필요하므로, proxy용 세션 클라이언트를 `shared/api/supabase`에 추가한다.

## 서버 신원 확인

서버 인가에 `getSession()`을 쓰지 않는다. `getSession()`은 쿠키를 재검증 없이 돌려주므로 신뢰할 수 없다.

- 기본은 `getClaims()`를 쓴다. 서명 검증된 JWT를 읽으므로 RLS가 보는 claim과 일치하고 빠르다.
- 즉시 권한 회수가 중요한 mutation Route Handler에서만 `getUser()`를 병행한다.

`entities/session`은 `getClaims()` 결과에서 admin 여부를 판정하는 함수를 공개한다. 입력 타입은 검증된 claim으로 제한한다.

## 권한 모델 (posts RLS)

claim 표현은 다음으로 통일한다.

```sql
((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
```

`authenticated`에 `select, insert, update` grant를 주고(DELETE는 삭제 기능 도입 시 함께 추가), 작업별로 정책을 분리한다.

```sql
-- 조회: admin은 draft 포함 전부 (기존 "published만" 정책과 permissive OR 결합)
create policy "Admin select all posts" on public.posts
  for select using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- 삽입: 새로 써질 행 검증
create policy "Admin insert posts" on public.posts
  for insert with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- 수정: 기존 행과 바뀔 행 둘 다
create policy "Admin update posts" on public.posts
  for update using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
              with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
```

기존 `service_role`의 write grant는 유지한다. 블로그 import 스크립트가 RLS를 우회해 계속 동작해야 하기 때문이다.

## Storage 정책 (post-images)

`post-images`는 public bucket으로 명시한다. public bucket이면 다운로드가 RLS를 우회하므로 별도의 public read 정책이 필요 없고, `getPublicUrl()`이 만든 URL로 조회된다.

업로드는 bucket과 경로까지 좁힌 정책으로 제한한다. 업로드 응답의 `RETURNING` 때문에 SELECT 정책이 없으면 403이 날 수 있으므로 admin SELECT 정책도 함께 둔다.

```sql
create policy "Admin insert post images" on storage.objects
  for insert with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = 'posts'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admin select post images" on storage.objects
  for select using (
    bucket_id = 'post-images'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );
```

bucket에 `file_size_limit`과 `allowed_mime_types`(image/jpeg, image/png, image/webp, image/avif)를 설정하고, Route Handler에서도 MIME/크기를 재검사한다.

draft 글의 이미지도 public bucket이라 발행 전에 URL을 알면 조회될 수 있다. 개인 블로그 맥락에서 이 위험은 수용한다.

## app_metadata role 부여

운영자 유저에 admin claim을 부여하는 1회성 스크립트를 `scripts/`에 둔다.

- service role admin API(`auth.admin.updateUserById`)로 대상 유저의 `app_metadata.role`을 `admin`으로 설정한다.
- 대상 유저는 env `ADMIN_EMAIL`로 지정한다.

이미 발급된 JWT에는 role 변경이 즉시 반영되지 않으므로 순서를 고정한다.

1. 운영자 계정 생성(Supabase 대시보드/CLI).
2. role 부여 스크립트 실행.
3. 최초 로그인.

이미 로그인한 상태에서 role을 부여했다면 `refreshSession()` 또는 재로그인이 필요하다. 권한 회수 시에는 전역 sign-out으로 refresh token까지 폐기한다. access JWT는 만료 전까지 유효하므로, 회수 지연은 JWT 만료 시간 안에서 수용한다.

## 코드 구조 (FSD)

FSD 레이어 규칙(`app → pages → widgets → features → entities → shared`)을 따른다.

- `src/entities/session`(신규): `getClaims` 래핑, `isAdmin`, `getAdminUser`. 인증된 뷰어 도메인.
- `src/features/auth`(신규): `api/signIn`·`api/signOut`(browser client), `model/useSignIn`, `ui/LoginForm`.
- `src/pages/admin-login`(신규): `ui/AdminLoginPage`.
- `src/shared/api/supabase`: 기존 browser/server/admin 클라이언트 3종을 재사용한다.
- `app/admin/(public)/login/page.tsx`, `app/admin/(protected)/layout.tsx`, 기존 posts 라우트 이동.
- `proxy.ts`(루트).

`shared/api/admin`의 `verifyAdminPostToken`은 제거한다. admin 인가 판단은 `shared`가 아니라 `entities/session`에 둔다.

## Route Handler 변경

`app/api/admin/*` 세 라우트를 세션 기반으로 바꾼다.

- service role 클라이언트(`createSupabaseAdminClient`) → 세션 클라이언트(`createSupabaseServerClient`)로 교체한다.
- `x-admin-post-token` 검증을 제거한다.
- 세션 검증과 Origin 검사를 추가한다.
- Supabase 에러를 HTTP 상태로 매핑한다.

Route Handler는 HTTP 경계(세션 확인, Origin 검사, body 파싱, 응답)만 담당하고, Supabase mutation은 기존대로 `entities/post/api/adminPosts.ts`가 맡는다.

## 에러 → HTTP 상태 매핑

RLS 거부 하나만 보고 상태를 정하지 않는다. 상황별로 구분한다.

- 검증된 사용자 없음: 401.
- 로그인했으나 admin claim 없음: 403.
- 대상 행 없음: 404.
- slug 중복(Postgres `23505`): 409.
- 잘못된 요청 본문: 422.
- RLS 거부(Postgres `42501`): 외부에는 403으로 정규화하되, admin 검증 통과 후 발생했다면 stale JWT/정책 배포 오류로 내부 로깅.

DB 원문 에러(테이블/컬럼/제약 이름)는 응답에 노출하지 않는다.

## 기존 토큰 제거

외과적으로 다음만 제거한다.

- `src/shared/api/admin/auth.ts`의 `verifyAdminPostToken`과 그 테스트, export.
- `shared/config/env.ts`의 `adminPostToken`과 `ADMIN_POST_TOKEN`, `.env.example` 항목. `ADMIN_EMAIL`을 추가한다.
- `PostEditorForm`의 Admin token 필드, `sessionStorage`, `x-admin-post-token` 헤더.
- `uploadPostImage(file, token)`의 `token` 인자.

장식용 `public.users` 테이블은 이번 요청 범위 밖이므로 건드리지 않는다.

## 보안 운영 설정

배포/운영 설정으로 다음을 적용한다.

- 프로덕션 Supabase Auth에서 "Allow new users to sign up"과 anonymous sign-in을 비활성화한다. anon key로 signup API를 직접 호출할 수 있기 때문이다.
- 유출 비밀번호 차단(HaveIBeenPwned)과 Auth rate limit을 확인한다.
- 운영자 비밀번호는 길고 무작위로 둔다.
- 쿠키의 `SameSite=Lax`, `Secure`를 확인하고, mutation Route Handler에서 `Origin`이 운영 도메인과 일치하는지 검사한다.

## 검증 전략

각 task는 TDD로 진행한다. 설명문은 한국어로 쓴다.

유닛(mock) 검증.

- `signIn`/`signOut`: supabase auth mock 성공/실패.
- `isAdmin`/`getAdminUser`: claim 유무 분기.
- `proxy` 판정: 순수 함수로 추출해 세션/role 분기.
- Route Handler: 세션 없음 401 / 비admin 403 / 정상 201·200과 에러 매핑.

통합(로컬 Supabase) 검증. mock으로 잡을 수 없는 보안 경계를 확인한다.

- anon / authenticated 비admin / admin 세 주체로 `posts` SELECT/INSERT/UPDATE.
- 세 주체로 `post-images` Storage 업로드.
- role 부여 전후 refresh 동작과 admin role 회수 시나리오.

마무리 검증은 프로젝트 루틴(`npm run fsd && npm run lint && npm run type-check && npm run test && npm run format`)을 따르고, migration은 `supabase db push --dry-run` 확인 후 push한다.

## 구현 순서

1. `entities/session`에 `getClaims`/`isAdmin`/`getAdminUser`를 만든다.
2. `features/auth`에 signIn/signOut과 LoginForm을 만든다.
3. `pages/admin-login`과 `app/admin/(public)/login`을 만든다.
4. route group으로 기존 admin 라우트를 `(protected)`로 이동하고 보조 가드 레이아웃을 만든다.
5. 루트 `proxy.ts`로 세션 갱신과 optimistic redirect를 만든다.
6. posts write RLS 정책과 authenticated grant migration을 만든다.
7. Storage 정책과 bucket 제약 migration을 만든다.
8. app_metadata role 부여 스크립트를 만든다.
9. admin Route Handler를 세션 클라이언트로 바꾸고 에러 매핑과 Origin 검사를 추가한다.
10. 에디터에서 토큰 필드와 인자를 제거한다.
11. `verifyAdminPostToken`과 `ADMIN_POST_TOKEN`을 제거하고 `ADMIN_EMAIL`을 추가한다.
12. 로컬 Supabase 통합 테스트로 RLS/Storage 경계를 검증한다.
13. 로컬 검증 후 remote migration과 Auth 설정을 적용한다.

## 보류와 후속

- TOTP MFA와 RLS `aal2` 조건: 후속 옵션.
- 슬라이스 구조 축소(Codex 제안): "학습 목적이라도 구조는 정석 유지" 방침과 충돌해 미채택.
- draft 이미지 비공개화(private bucket/signed URL): 필요해지면 별도 설계.
- 삭제 기능과 DELETE grant/정책: 삭제 UI 도입 시 함께.
