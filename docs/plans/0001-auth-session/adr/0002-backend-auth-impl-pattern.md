# 0002. 백엔드 인증 구현 패턴 (가드·쿠키·해싱·에러·CORS·Swagger)

- 상태: 승인됨
- 일자: 2026-04-26

## Context
NestJS 11에서 인증을 구현할 때 가드 방식, 쿠키 발급 방식, 비밀번호 해싱 강도, 에러 메시지 일관화, CORS, Swagger 데코레이션 컨벤션을 결정한다. 학습 목적이고 OAuth는 비범위.

## Options

### 가드
- **A1. `@nestjs/passport` + `passport-jwt`** — 생태계 표준. OAuth 확장 시 일관성. 의존성 추가
- **A2. 직접 `JwtAuthGuard` + `JwtService`** — 의존성 최소, 흐름 명시적
- **A3. passport만 + 커스텀 strategy** — 추상화 반만 쓰는 어색한 절충

### 쿠키 발급
- **B1. `@Res() res: Response`** — NestJS 직렬화 bypass
- **B2. `@Res({ passthrough: true })`** — res 접근 + 직렬화 살림
- **B3. 인터셉터/데코레이터 추상화** — 컨트롤러 순수성 ↑, 추상화 비용

### 비번 해싱
- bcrypt rounds **10 / 12 / 14**

### 에러 일관화
- **D1. 서비스에서 `UnauthorizedException` 직접 throw, 메시지 통일은 컨벤션**
- **D2. 도메인 에러 + 글로벌 ExceptionFilter**

## Decision

### 가드: A2
직접 `JwtAuthGuard` 작성. `req.cookies['access_token']` 추출 → `JwtService.verify()`. OAuth 도입 시 리팩토링 비용은 그때 부담.

### 쿠키: B2 + 옵션 한 곳 관리
`@Res({ passthrough: true })` 패턴. 쿠키 옵션은 `backend/src/auth/cookie.config.ts`에 상수 분리: `COOKIE_OPTS_ACCESS`, `COOKIE_OPTS_REFRESH`, `COOKIE_OPTS_CLEAR`.

**환경별 분기**:
- dev(`localhost`): `domain` **미지정**(Host-only), `secure: false`
- prod: `domain` 미지정(Host-only) 기본. 미래 서브도메인 분리 배포로 same-site 공유가 필요해질 때만 명시 도메인 도입(별도 plan)
- `secure: COOKIE_SECURE === 'true'`(prod에서 true 강제, 부트 검증으로 — ADR 0003 참조)

**로그아웃 쿠키 만료 규칙**:
- access·refresh **양쪽 모두** `COOKIE_OPTS_CLEAR`로 `Max-Age=0` 발급. `httpOnly`/`Secure`/`SameSite`/`Path`/`Domain` 모두 발급 시 옵션과 동일해야 브라우저가 같은 쿠키로 인식해 삭제됨
- access는 stateless JWT라 쿠키가 만료돼도 토큰 자체는 만료 시각(최대 15분)까지 살아 있다 — 이 잔존 위험은 access TTL을 짧게(15분) 둠으로써만 완화

### bcrypt: rounds 12
- 약 300ms, 2024+ 권장. `BCRYPT_ROUNDS` env로 외부화하되 부트 검증으로 10–14 범위 강제(ADR 0003)
- **rehash-on-login 정책(미래)**: 로그인 성공 시 저장된 해시의 round가 현재 `BCRYPT_ROUNDS` 미만이면 백그라운드로 rehash 후 저장. 이번 plan에서는 구현 X, 의도만 ADR에 기록

### 에러: D1 + timing-safe + prod 메시지 최소화
- 서비스 레이어에서 `UnauthorizedException('Invalid credentials')` 통일 throw. 로그인은 사용자 존재 여부와 무관하게 동일 분기·동일 응답
- **dummy bcrypt 해시**: `BCRYPT_ROUNDS`와 동일 round로 사전 생성된 고정 해시 1개를 모듈 상수(`DUMMY_HASH`)로 둠. 사용자 미존재 시 `bcrypt.compare(password, DUMMY_HASH)` 호출로 timing 일정화. 매 요청 새로 생성하면 timing이 깨지므로 반드시 모듈 상수
- `class-validator` + `ValidationPipe` 글로벌 적용 (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`). prod에서는 `disableErrorMessages: true` 또는 필드명 검열 ExceptionFilter — 입력 검증 실패 시 필드 enumeration 누설 방지

### CORS (`main.ts`)
- `app.enableCors({ origin: <FRONT_ORIGIN>, credentials: true })`
- `FRONT_ORIGIN`은 env(`FRONTEND_ORIGIN`)에서 주입. dev: `http://localhost:3000`, prod: `https://limjaejoon.com`
- `credentials: true`는 PRD `withCredentials: true`와 짝. 누락 시 쿠키 미전송

### Swagger 데코레이션 컨벤션
- DTO에 `class-validator` + `@ApiProperty`(예시값 포함). `@nestjs/swagger`의 `mapped-types`(`PickType`/`PartialType`)로 상속 시 `@ApiProperty` 자동 전파
- `SecurityScheme`에 `cookieAuth` 등록 → 보호 엔드포인트 컨트롤러에 `@ApiCookieAuth()`, 응답에 `@ApiResponse({ status: 401, description: 'Invalid credentials' })` 등 명시
- `main.ts` 마운트는 `if (process.env.NODE_ENV !== 'production') SwaggerModule.setup('api/docs', app, doc)`로 가드 — env 검증을 통과한 정확한 값 기준

## Consequences
**얻는 것**: 의존성 최소(passport 라인 0). timing-safe 로그인. 쿠키 정책 단일 소스. CORS·credentials 한 줄로 관리. Swagger UI는 dev에서만 노출.

**잃는 것**: OAuth/SAML 추가 시 passport 도입 리팩토링. ExceptionFilter 미도입으로 에러 응답 포맷이 NestJS 기본에 묶임. dummy bcrypt는 round 변경 시 상수도 함께 재생성 필요.

함정 메모:
- `TokenExpiredError`와 `JsonWebTokenError` 모두 동일 401로 매핑(내부 힌트 미노출)
- 로그아웃 시 쿠키 삭제만 하지 말고 DB `revoked_at` 세팅(ADR 0001 정합) — 안 그러면 access 만료까지 토큰 잔존 + refresh도 살아 있음
- prod에서 `forbidNonWhitelisted` 에러 메시지가 필드명을 그대로 노출하면 enumeration 도움 → 필터링 필수
- raw query 사용 금지(TypeORM Repository API만). 불가피하면 parameterized only

## Learnings
<!-- /execute 후 채움 -->
