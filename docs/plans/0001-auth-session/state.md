# 작업 상태

## 기능명
auth-session — 이메일/비밀번호 가입·로그인 + access/refresh JWT 세션(httpOnly 쿠키, refresh 회전·재사용 감지, 사전 토큰 재발급)

## 관련 문서
- PRD: `docs/plans/0001-auth-session/PRD.md`
- ADR: `docs/plans/0001-auth-session/adr/`
  - 0001 — Refresh 토큰 저장·회전·재사용 감지 모델 (opaque + sha-256 + family_id)
  - 0002 — 백엔드 인증 구현 패턴 (가드·쿠키·해싱·에러·CORS·Swagger)
  - 0003 — 백엔드 모듈/마이그레이션 구조 + 환경 변수 검증
  - 0004 — 사전(Proactive) 토큰 재발급 메커니즘
  - 0005 — Server Component 인증 검증 (middleware vs SC, redirect 검증)
  - 0006 — 프론트 모듈 구조와 타입 배치
  - 0007 — TanStack Query 통합 패턴
  - 0008 — 테스트 전략 (백엔드 단위, 프론트 Vitest+MSW, 보안 회귀 시나리오)

## 현재 단계
- [x] PRD 작성
- [x] ADR 초안
- [x] ADR 검토 (architect-reviewer + security-auditor — 1라운드 완료, 모든 Critical·Should 반영)
- [ ] 구현
- [ ] 코드 검토 (code-reviewer + security-auditor + accessibility-tester)
- [ ] 회고 (study-note)

## 자동 라우팅 결과
- 도메인: **node-specialist**(backend) + **nextjs-developer**(frontend) — 양쪽 모두 호출
- 보안 검토: **필요** (PRD 보안 민감도 4/5 체크 — 인증/세션, 권한 가드, PII/시크릿, 외부 입력 인젝션)
- 접근성 검토: **필요** (frontend 포함 — 가입/로그인 폼 a11y. ADR 0006의 FormField + aria 패턴, ADR 0008의 폼 검증 시나리오와 정합)

## 마지막 작업 요약
ADR 8개 초안 완료 → architect/security 1라운드 검토 → Critical 4건(시크릿 부트 검증, 로그아웃 access 쿠키, SSR Set-Cookie 비포워딩, open redirect 방어), Should 7건, 정합성 5건 모두 ADR에 반영. 구현 대기.

## 다음 액션
새 세션에서 `/execute 0001-auth-session` 호출 시 즉시 진입할 단위. **백엔드 우선 → 프론트 순**(프론트가 백엔드 응답 스키마에 의존). 각 단계는 commit 1회 단위.

### Phase 1 — 백엔드 기반
1. `backend/package.json`에 패키지 추가: `@nestjs/jwt`, `@nestjs/typeorm`, `typeorm`, `pg`, `bcrypt`, `@types/bcrypt`, `class-validator`, `class-transformer`, `cookie-parser`, `@types/cookie-parser`, `@nestjs/swagger`, `joi` 또는 `zod`(env 검증)
2. `backend/src/config/env.validation.ts` — Joi/zod 스키마 작성 (ADR 0003). `JWT_*_SECRET 32+`, 두 시크릿 다름, `BCRYPT_ROUNDS 10–14`, `COOKIE_SECURE` prod=true, `FRONTEND_ORIGIN` URL
3. `backend/src/database/data-source.ts` — DataSource 정의 + dotenv 직접 로드(CLI용)
4. `app.module.ts` — `ConfigModule.forRoot({ validationSchema })` + `TypeOrmModule.forRootAsync`
5. `package.json` 스크립트: `migration:generate`, `migration:run`, `migration:revert`
6. `.env.example` 내용 사용자에게 안내(프로젝트 훅이 Claude Write 차단)

### Phase 2 — Users + Auth 모듈
7. `users/user.entity.ts`, `users/users.service.ts`(findByEmail/create), `users/users.module.ts`
8. `auth/entities/refresh-token.entity.ts` — ADR 0001 스키마 + 인덱스
9. 초기 마이그레이션 1개 — users + refresh_tokens 테이블
10. `auth/cookie.config.ts` — `COOKIE_OPTS_ACCESS/REFRESH/CLEAR` 상수 (env 분기 포함)
11. `auth/dto/{signup,login}.dto.ts` — `class-validator` + `@ApiProperty`
12. `auth/refresh-token.service.ts` — atomic 회전, 재사용 감지(family 폐기), logout
13. `auth/auth.service.ts` — bcrypt + dummy hash 모듈 상수, signup/login/refresh/logout/me 로직
14. `auth/jwt-auth.guard.ts` — 쿠키에서 access 추출 → JwtService.verify
15. `auth/auth.controller.ts` — `@Res({ passthrough: true })`, `@ApiCookieAuth`
16. `auth/*.spec.ts` — ADR 0008의 백엔드 시나리오 모두

### Phase 3 — main.ts + Swagger + CORS
17. `main.ts` — `cookie-parser`, ValidationPipe 글로벌(`whitelist`, `forbidNonWhitelisted`, `transform`, prod에서 `disableErrorMessages`), `enableCors({ origin: FRONTEND_ORIGIN, credentials: true })`, Swagger 마운트(NODE_ENV !== production)
18. 백엔드 dev 띄워서 Swagger UI에서 signup/login/refresh/me 수동 호출 검증

### Phase 4 — 프론트 기반
19. `frontend/package.json`에 패키지 추가: `axios`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `msw`(devDep)
20. `lib/api/tokenStore.ts` — accessExpiresAt + refreshPromise (ADR 0004)
21. `lib/api/client.ts` — axios instance + 사전 refresh 인터셉터 + 401 fallback
22. `lib/auth/safeReturnTo.ts` — open redirect 방어 헬퍼 (ADR 0005)
23. `lib/auth/verifySession.ts` — `React.cache()` + `cookies()` + native fetch (ADR 0005)
24. `app/providers.tsx` — QueryClientProvider (ADR 0007). `app/layout.tsx`에서 wrap
25. `middleware.ts` — 보호 경로 매처 allowlist + 쿠키 존재 체크

### Phase 5 — features/auth
26. `features/auth/types.ts` — `User`, `LoginRequest/Response`, `SignupRequest/Response`, `MeResponse`, `AuthErrorResponse`
27. `features/auth/api/{signup,login,logout,refresh,getMe}.ts`
28. `features/auth/hooks/{useSignup,useLogin,useLogout,useMe}.ts`
29. `features/auth/components/{FormField,LoginForm,SignupForm}.tsx` + `*.css.ts` (디자인 토큰 사용, `colorDanger` 추가 후)
30. `styles/theme.css.ts`(또는 토큰 정의 파일)에 `colorDanger`/`colorDangerSubtle` dark·light 추가 — limjaejoon-blog-design 스킬 참조

### Phase 6 — 라우트
31. `app/login/page.tsx`, `app/signup/page.tsx` — 한 줄 진입점, LoginForm/SignupForm 렌더
32. `app/(protected)/layout.tsx` — `await verifySession()` 호출
33. `app/(protected)/me/page.tsx` — User 표시

### Phase 7 — 프론트 테스트
34. `tests/lib/auth/safeReturnTo.test.ts` — 화이트리스트 검증
35. `tests/lib/auth/verifySession.test.ts` — fetch mock + redirect mock
36. `tests/lib/api/client.test.ts` — 사전 refresh 분기, mutex, 401 fallback (MSW + fakeTimers)
37. `tests/features/auth/hooks/*.test.ts`, `tests/features/auth/api/*.test.ts`
38. `tests/features/auth/components/LoginForm.test.tsx` — a11y 어서션(aria-invalid, role=alert)

### Phase 8 — 코드 검토 + 마무리
39. `code-reviewer` + `security-auditor` + `accessibility-tester` 병렬 호출
40. 피드백 반영
41. `/study-note`로 회고 → `reports/2026-04-26-auth-session.md`

## 건드린 파일 (현재까지)
- `docs/plans/0001-auth-session/PRD.md` — 기능 요구사항
- `docs/plans/0001-auth-session/adr/0001-refresh-token-storage.md`
- `docs/plans/0001-auth-session/adr/0002-backend-auth-impl-pattern.md`
- `docs/plans/0001-auth-session/adr/0003-backend-module-structure.md`
- `docs/plans/0001-auth-session/adr/0004-proactive-refresh-mechanism.md`
- `docs/plans/0001-auth-session/adr/0005-ssr-auth-verification.md`
- `docs/plans/0001-auth-session/adr/0006-frontend-module-and-types.md`
- `docs/plans/0001-auth-session/adr/0007-tanstack-query-integration.md`
- `docs/plans/0001-auth-session/adr/0008-test-strategy.md`
- `docs/plans/0001-auth-session/state.md` — 본 핸드오프 문서

## 미해결 결정 / 질문
- **`.env.example` 내용**: 사용자가 직접 작성해야 함(프로젝트 훅이 Claude의 Write/Edit 차단). `/execute` 진입 시 ADR 0003의 변수 목록을 사용자에게 제시하고 수기로 작성 요청
- **`COOKIE_DOMAIN` 기본값**: 현재 ADR은 "Host-only(미지정) 권장". prod 배포 도메인이 확정되면 `.env`에 빈 값 또는 미설정으로 둘지 최종 확인 필요
- **Postgres 접속 정보**: 사용자가 Docker로 띄운 Postgres의 host/port/user/pass/dbname을 `.env`에 넣어야 함. `/execute` 진입 시 사용자에게 묻기
- **bcrypt dummy hash 생성 시점**: 모듈 상수(ADR 0002). 첫 부팅 시 `BCRYPT_ROUNDS`로 1회 생성해 lazy 캐시할지, 빌드 타임에 생성할지 — 구현 선택. 권장: 모듈 import 시 1회(Promise로) 생성
- **마이그레이션 파일명 prefix**: TypeORM CLI 기본은 timestamp. 프로젝트 컨벤션 추가 없으면 그대로

## 시간 추정 (참고)
| Phase | 예상 |
|---|---|
| Phase 1–3 (백엔드 기반·모듈·main) | 60–90분 |
| Phase 4–6 (프론트 기반·features·라우트) | 50–80분 |
| Phase 7 (프론트 테스트) | 30–50분 |
| Phase 8 (검토 + 회고) | 20–40분 |
| **합계** | **2.5–4시간** |
실제는 사용자 검토/수정 라운드 횟수에 따라 변동.
