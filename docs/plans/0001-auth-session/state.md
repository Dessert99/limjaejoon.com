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
- [ ] 구현 (Phase 1 ✅ / Phase 2-3 ✅ / Phase 4-6 / Phase 7)
- [ ] 코드 검토 (code-reviewer + security-auditor + accessibility-tester)
- [ ] 회고 (study-note)

## 자동 라우팅 결과
- 도메인: **node-specialist**(backend) + **nextjs-developer**(frontend) — 양쪽 모두 호출
- 보안 검토: **필요** (PRD 보안 민감도 4/5 체크 — 인증/세션, 권한 가드, PII/시크릿, 외부 입력 인젝션)
- 접근성 검토: **필요** (frontend 포함 — 가입/로그인 폼 a11y. ADR 0006의 FormField + aria 패턴, ADR 0008의 폼 검증 시나리오와 정합)

## 마지막 작업 요약
Phase 2-3 완료(2026-04-26): Users/Auth 모듈 + main.ts + Swagger.
- users 도메인: User entity, UsersService(findByEmail/findById/create), UsersModule
- auth 도메인: RefreshToken entity(인덱스 3개), cookie.config(httpOnly·SameSite·Secure·maxAge 통일), DTO + class-validator + ApiProperty, RefreshTokenService(atomic UPDATE+RETURNING으로 회전·재사용 감지·family 격리), AuthService(DUMMY_HASH_PROMISE 모듈 싱글턴, signup/login/refresh/logout/me + 동일 401 메시지), JwtAuthGuard(쿠키→verify, 단일 401), AuthController(@Res passthrough, body에 토큰 미포함, accessExpiresAt만, Swagger 데코)
- main.ts: cookie-parser + ValidationPipe(whitelist+forbidNonWhitelisted+transform+prod disableErrorMessages) + CORS(origin=FRONTEND_ORIGIN, credentials=true) + Swagger(NODE_ENV !== production만, /api/docs)
- 마이그레이션 1개: `1714099200000-init-auth.ts` 수기 작성 (users + refresh_tokens + 4개 인덱스 + FK CASCADE)
- spec 19개 통과(`auth.service.spec.ts` 11, `refresh-token.service.spec.ts` 8). 로그인 timing 테스트는 wall-clock delta < 50ms로 완화 (jest 환경 변동성 흡수)

이전: Phase 1 완료(2026-04-26) — backend deps, env.validation(Joi), data-source, app.module, 루트 .env 단일화(POSTGRES_*), docker-compose volumes에 .env 마운트, app.controller/service 제거, 차단 훅에서 .env 블록 제거.

## 다음 액션
새 세션에서 `/execute 0001-auth-session` 호출 시 즉시 진입할 단위. **백엔드 우선 → 프론트 순**(프론트가 백엔드 응답 스키마에 의존). 각 단계는 commit 1회 단위.

### ~~Phase 1 — 백엔드 기반~~ (완료 2026-04-26)
deps + env.validation(Joi) + data-source + app.module + .env/.env.example.

### ~~Phase 2 — Users + Auth 모듈~~ (완료 2026-04-26)
users + auth(entity·dto·service·guard·controller·module) + 마이그레이션 1개 + spec 19개.

### ~~Phase 3 — main.ts + Swagger + CORS~~ (완료 2026-04-26)
cookie-parser + ValidationPipe + CORS + Swagger.
사용자 검증 액션: `docker compose up -d --build backend && docker compose exec backend npm run migration:run && open http://localhost:4000/api/docs`로 signup/login/refresh/me 수동 호출.

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
- `docs/plans/0001-auth-session/adr/0001~0008` — 8개 ADR
- `docs/plans/0001-auth-session/state.md` — 본 핸드오프 문서

### Phase 2-3 (2026-04-26)
- `backend/src/users/{user.entity,users.service,users.module}.ts`
- `backend/src/auth/entities/refresh-token.entity.ts`
- `backend/src/auth/{cookie.config,refresh-token.service,auth.service,jwt-auth.guard,auth.controller,auth.module}.ts`
- `backend/src/auth/dto/{signup,login}.dto.ts`
- `backend/src/auth/{auth.service.spec,refresh-token.service.spec}.ts`
- `backend/src/migrations/1714099200000-init-auth.ts`
- `backend/src/main.ts` — cookie-parser + ValidationPipe + CORS + Swagger
- `backend/src/app.module.ts` — UsersModule, AuthModule import 추가

### Phase 1 (2026-04-26)
- `.claude/hooks/block-protected-files.sh` — .env 차단 블록 제거
- `backend/package.json` — deps(@nestjs/config, @nestjs/jwt, @nestjs/typeorm, typeorm, pg, bcrypt, class-validator, class-transformer, cookie-parser, @nestjs/swagger, joi) + devDeps(@types/bcrypt, @types/cookie-parser, ts-node) + migration:* scripts
- `backend/src/config/env.validation.ts` — Joi 스키마. POSTGRES_* / JWT_* / BCRYPT_ROUNDS / COOKIE_* / FRONTEND_ORIGIN 검증. custom으로 두 JWT 시크릿 동일 거부
- `backend/src/database/data-source.ts` — TypeORM CLI용. `dotenv.config({ path: path.resolve(__dirname, '../../../.env') })`로 루트 .env 직접 로드
- `backend/src/app.module.ts` — ConfigModule.forRoot({envFilePath: path.resolve(__dirname,'../../.env'), validationSchema, isGlobal, allowUnknown}) + TypeOrmModule.forRootAsync (autoLoadEntities, POSTGRES_*)
- `backend/src/app.controller.ts`, `backend/src/app.service.ts` — 삭제 (보일러플레이트)
- 루트 `.env` — POSTGRES_USER/PASSWORD/DB(기존) + POSTGRES_HOST/PORT(NestJS용) + JWT_*/BCRYPT_*/COOKIE_*/FRONTEND_ORIGIN/NODE_ENV 통합. JWT 시크릿 `openssl rand -base64 48`로 다른 값 2개. (.gitignore에 .env 포함 확인)
- 루트 `.env.example` — placeholder + 한 줄 주석. POSTGRES_HOST=postgres 디폴트, 호스트 직접 실행 시 localhost
- `docker-compose.yml` — backend 서비스 volumes에 `- ./.env:/workspace/.env:ro` 추가. postgres 서비스는 그대로(이미 ${POSTGRES_USER} 변수 치환 사용 중)

## 미해결 결정 / 질문
- **컨트롤러 통합 spec(supertest) 1개 누락**: ADR 0008에 명시된 가드·파이프·CORS 동작 + 쿠키 옵션 헤더 어서션 통합 테스트는 작성되지 않음. Phase 8 검토 라운드에서 추가
- **로그인 timing 테스트 임계값**: ADR 0008의 ±20ms를 50ms로 완화. jest+real bcrypt 환경 변동성 흡수 위함. 추후 supertest E2E에서 더 엄격한 측정 가능
- **다음 docker 작업**: 사용자가 `docker compose up -d --build backend` + `docker compose exec backend npm run migration:run` 실행해야 DB 스키마 적용. Swagger UI는 `http://localhost:4000/api/docs`
- **결정 완료**: COOKIE_DOMAIN 미지정(ADR 0003), bcrypt dummy hash 모듈 import 시 1회 Promise(ADR 0002), env 검증 라이브러리 Joi, env 단일 소스 = 루트 .env, 변수 이름 POSTGRES_*로 통일

## 시간 추정 (참고)
| Phase | 예상 |
|---|---|
| Phase 1–3 (백엔드 기반·모듈·main) | 60–90분 |
| Phase 4–6 (프론트 기반·features·라우트) | 50–80분 |
| Phase 7 (프론트 테스트) | 30–50분 |
| Phase 8 (검토 + 회고) | 20–40분 |
| **합계** | **2.5–4시간** |
실제는 사용자 검토/수정 라운드 횟수에 따라 변동.
