# auth-session

## 목표
이메일/비밀번호 기반 회원가입·로그인과 access/refresh JWT 세션을 도입한다. 토큰은 httpOnly 쿠키로 보관하고, refresh 토큰은 서버에서 회전·재사용을 감지한다. 프론트는 access 만료 시각을 응답 body로 받아 사전(proactive)에 재발급한다.

## 범위 (scope)

- [x] **frontend** — 가입/로그인 페이지·폼, 공용 axios 클라이언트(인터셉터·사전 refresh), TanStack Query 기반 인증 훅, 인증된 라우트 가드(middleware + Server Component), 로그아웃, Vitest 단위·통합 테스트
- [x] **backend** — `auth` 모듈(컨트롤러·서비스·가드), `users`·`refresh_tokens` 엔티티(TypeORM), JWT 발급·검증, bcrypt 해싱, refresh 회전·재사용 감지, 쿠키 발급, `accessExpiresAt` 응답 body 포함
- [ ] **infra** — Docker Postgres는 이미 떠 있고 이번 plan은 건드리지 않는다. TypeORM 마이그레이션은 backend 안에서 수행.

## 보안 민감도

- [x] 인증 / 세션 / 로그인
- [x] 권한 / RBAC / 접근 제어 — 단순 "인증 여부" 가드 수준 (역할 분리는 비범위)
- [x] PII / 시크릿 / 자격증명 — 비밀번호 해시, JWT 시크릿, 쿠키 보관
- [ ] 결제 / 금융 데이터
- [x] 외부 입력 → DB/쿼리 (인젝션 표면) — 가입·로그인 입력값 (`class-validator`로 DTO 검증)

## 완료 기준 (Done)

### 백엔드
- [ ] `POST /auth/signup` — 이메일 형식·비번 8자 이상 검증, bcrypt 해싱, 중복 이메일 409, 성공 시 access·refresh 쿠키 발급 + `{ user, accessExpiresAt }` 반환
- [ ] `POST /auth/login` — 자격 검증 실패 시 일관된 401(이메일 존재 여부 누설 금지), 성공 시 access·refresh 쿠키 발급 + `{ user, accessExpiresAt }` 반환
- [ ] `POST /auth/refresh` — refresh 쿠키 검증 → 새 access·새 refresh 발급(회전), 이전 refresh 무효화. 이미 무효화된 refresh가 다시 들어오면 해당 사용자의 모든 활성 refresh 폐기 + 401
- [ ] `POST /auth/logout` — 현재 refresh 무효화, 양쪽 쿠키 삭제
- [ ] `GET /auth/me` — access 쿠키 검증 통과 시 현재 사용자 반환
- [ ] 모든 인증 쿠키: `httpOnly`, `Secure`(prod), `SameSite=Lax`, `Path=/`
- [ ] Access TTL 15분 / Refresh TTL 7일. 시크릿은 `.env`에서 주입(`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`)
- [ ] TypeORM 엔티티 + 초기 마이그레이션 1개. `npm run migration:run`으로 적용
- [ ] OpenAPI/Swagger — `@nestjs/swagger`로 DTO·컨트롤러에 데코레이터. `main.ts`에서 `NODE_ENV !== 'production'`일 때만 `/api/docs`에 Swagger UI 마운트. 모든 인증 엔드포인트의 요청·응답 스키마와 에러 코드(401/409 등)가 문서화될 것
- [ ] 단위 테스트(co-located `.spec.ts`): refresh 회전·재사용 감지, 비번 검증 실패, 만료 토큰 처리, 중복 이메일 처리

### 프론트엔드
- [ ] `frontend/lib/api/client.ts` — axios instance 1개. `withCredentials: true`. request interceptor에서 사전 refresh(아래 정책), response interceptor에서 401 fallback
- [ ] `frontend/features/auth/api/` — `signup`, `login`, `logout`, `refresh`, `getMe` 함수. 위 client만 import
- [ ] `frontend/features/auth/hooks/` — `useSignup`, `useLogin`, `useLogout`(mutation), `useMe`(query). TanStack Query로 컴포넌트가 소비
- [ ] `frontend/features/auth/types.ts` — 도메인 타입(`User`, `LoginRequest`, `LoginResponse` 등) 모음. `Parameters<...>`/`Awaited<ReturnType<...>>` 같은 추론 유틸은 사용처 co-location
- [ ] `app/login/page.tsx`, `app/signup/page.tsx` — 클라이언트 컴포넌트 폼. Vanilla Extract + 디자인 토큰. 에러 메시지 표시
- [ ] 디자인 토큰에 `colorDanger` 계열 추가(dark/light 양쪽) — 폼 에러 표시 하드코딩 회피용 부수 작업
- [ ] `app/me/page.tsx`(또는 동등 보호 라우트) — Server Component에서 `cookies()` 읽고 백엔드 `/auth/me` 호출(native fetch)로 검증, 401이면 `redirect('/login')`
- [ ] `middleware.ts` — 보호 경로에서 access 쿠키 존재 여부만 체크 → 없으면 `/login`으로 리디렉트(실제 검증은 SC에서)
- [ ] **사전 refresh 정책**: 로그인/refresh/me 응답의 `accessExpiresAt`을 메모리 store에 보관 → axios request interceptor에서 `now + 60s >= accessExpiresAt`이면 요청 전에 `/auth/refresh` 호출. 동시 다중 요청은 mutex로 1회만 수행
- [ ] **401 fallback**: 사전 refresh가 실패했거나 시계 오차로 그래도 401이 오면 1회 `/auth/refresh` 후 원 요청 재시도, 또 실패하면 로그아웃 처리(쿼리 캐시 invalidate + `/login` 이동)
- [ ] 단위 테스트(Vitest, `frontend/tests/` 미러 구조) — 폼 검증, 훅 상태 전환, axios 인터셉터의 사전 refresh 분기, mutex 동시성, 401 fallback
- [ ] 통합 테스트(Vitest + MSW) — 로그인 성공/실패, 사전 refresh 발화, 재사용 감지 시 로그아웃, 보호 페이지에서 만료 토큰 처리. 백엔드는 MSW로 모킹

## 비범위 (이번에 안 함)

- E2E (Playwright) — 당분간 도입 안 함
- 이메일 인증(verification), 비밀번호 재설정(forgot password) — 메일 인프라 결정 후 별도 plan
- 소셜/OAuth 로그인
- 다중 디바이스 활성 세션 목록 UI(refresh 회전 자체는 다중 디바이스 지원)
- RBAC/역할(admin·user 구분 등)
- 2FA, 비밀번호 복잡도 규칙(특수문자 강제 등) — 길이 8자 이상만
- Rate limiting, brute-force 방어 — 별도 plan(인프라 레이어)
- CSRF 추가 방어(Double Submit, SameSite=Strict 등) — same-origin + Lax 가정. 추후 보안 강화 plan에서
- OpenAPI 스펙 기반 프론트 타입 자동 생성 — 이번에는 `features/auth/types.ts` 수동 정의 유지. 추후 도메인 늘면 검토

## 참고

- 백엔드: NestJS 11 — `@nestjs/jwt`, `@nestjs/typeorm`, `typeorm`, `pg`, `bcrypt`, `class-validator`, `cookie-parser`, `@nestjs/swagger` 추가 예정
- 프론트: Next.js 16 App Router — `axios`, `@tanstack/react-query`, `@tanstack/react-query-devtools`(dev) 추가 예정
- 토큰 저장 전략: access·refresh 모두 httpOnly 쿠키. SameSite=Lax. `api.<domain>` ↔ `<domain>` same-site 가정
- `accessExpiresAt`은 응답 body로만 노출. 토큰 자체는 절대 body에 포함하지 않음
- TypeORM 마이그레이션은 `backend/src/migrations/`에 생성, `npm run migration:run`
- 테스트 위치 규약(메모리): backend는 co-located `.spec.ts`, frontend 단위·통합은 `frontend/tests/` 미러
- Server Component에서는 native `fetch`만 사용(axios는 클라이언트 전용)
