# 0003. 백엔드 모듈/마이그레이션 구조 + 환경 변수 검증

- 상태: 승인됨
- 일자: 2026-04-26

## Context
`backend/src/`는 NestJS 보일러플레이트만 있다. 인증 도입과 함께 도메인 모듈 구조, TypeORM 데이터소스·마이그레이션, 환경 변수 컨벤션과 부트 시 검증, 쿠키 도메인 정책을 결정한다.

## Options

### 디렉토리
- **A1. `auth/` 단일 모듈** — User 재사용 시 순환 의존
- **A2. `auth/` + `users/` flat 분리** — NestJS 일반 관례
- **A3. `features/auth/`, `features/users/` 그룹핑** — 도메인 5+ 일 때

### 데이터소스
- **B1. 루트 `ormconfig.ts`** — 비권장
- **B2. `backend/src/database/data-source.ts` + `forRootAsync` (ConfigService)** — 현 권장
- **B3. 루트 `datasource.ts`** — src 외부 빌드 포함 여부 확인 필요

## Decision

### 디렉토리: A2 (flat 분리)
```
backend/src/
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    refresh-token.service.ts
    jwt-auth.guard.ts
    cookie.config.ts
    entities/
      refresh-token.entity.ts
    dto/
      signup.dto.ts
      login.dto.ts
    *.spec.ts
  users/
    users.module.ts
    users.service.ts
    user.entity.ts
  database/
    data-source.ts
  migrations/
    1714099200000-init-auth.ts
  config/
    env.validation.ts                -- Joi 또는 zod schema
  app.module.ts
  main.ts
```
`refresh_tokens` 엔티티는 `auth/entities/`에 배치(도메인 응집). `users.service`만 `auth.service`가 의존, 역방향 없음.

### 데이터소스: B2
`backend/src/database/data-source.ts`에 DataSource 정의. `app.module.ts`는 `TypeOrmModule.forRootAsync({ inject: [ConfigService], useFactory })`로 같은 옵션 재사용. CLI 컨텍스트는 DI 없으므로 `data-source.ts` 최상단에 `dotenv.config()` 직접 로드 한 줄.

### 마이그레이션 정책
- `synchronize: false` 고정(prod·dev 모두). 스키마 변경은 항상 마이그레이션
- 스크립트: `migration:generate`, `migration:run`, `migration:revert`
- **롤백 정책**: dev에서만 `revert` 사용. **prod는 forward-only**(이미 적용된 마이그레이션 revert 시 데이터 손실 위험). prod 롤백이 필요하면 새 마이그레이션으로 역방향 변경 작성

### 환경 변수 컨벤션
`.env`, `.env.example`은 사용자가 직접 작성(프로젝트 훅이 Claude Write 차단).

**변수 목록**:
- `NODE_ENV`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — 32바이트 이상 랜덤, **두 값이 서로 달라야 함**
- `JWT_ACCESS_TTL=15m`, `JWT_REFRESH_TTL=7d`
- `BCRYPT_ROUNDS=12`
- `COOKIE_SECURE` — prod에서 `true` 강제
- `COOKIE_DOMAIN` — **기본 미지정**(Host-only 쿠키). 명시할 경우 모든 서브도메인이 쿠키를 받게 되어 미래 비신뢰 서브도메인 추가 시 토큰 누설 위험. 신뢰 서브도메인 화이트리스트가 문서화된 경우에만 사용
- `FRONTEND_ORIGIN` — CORS `origin` 값 (ADR 0002)

### 부트 시 검증 (`config/env.validation.ts`)
**Critical**: `ConfigModule.forRoot({ validationSchema })`로 다음을 강제. 미달 시 startup fail-fast.

| 변수 | 규칙 |
|---|---|
| `NODE_ENV` | `development` / `production` / `test` 중 하나 |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | string, 최소 32자, base64 또는 hex 형식 권장. **서로 다른 값** |
| `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL` | duration 문자열 |
| `BCRYPT_ROUNDS` | number, 10–14 범위 |
| `COOKIE_SECURE` | boolean. `NODE_ENV === 'production'`이면 반드시 `true` |
| `DB_*` | 모두 필수, port는 1–65535 |
| `FRONTEND_ORIGIN` | URL 형식, prod에서는 https:// 강제 |

검증 실패 시 NestJS는 부팅 자체가 실패한다. "있어야 한다"가 아니라 "없거나 미달이면 죽는다".

## Consequences
**얻는 것**: 모범 사례 정합. CLI/앱 양쪽에서 동일 DataSource 재사용. 마이그레이션 코드로 DB 진화 추적. 부트 검증으로 누락된 시크릿·약한 시크릿이 prod에 도달 불가. forward-only 정책으로 prod 데이터 안전.

**잃는 것**: `data-source.ts`가 두 컨텍스트(DI 있는 앱, DI 없는 CLI) 모두 동작 — dotenv 직접 로드 필요. `synchronize: false`는 초기 개발 속도를 약간 늦추나 마이그레이션 학습이 PRD 가치. forward-only는 dev에서 실수했을 때 schema 되돌리기 번거로움(dev에선 `revert` 허용으로 완화).

`features/` 그룹핑은 도메인 5+ 시 도입(YAGNI).

## Learnings
<!-- /execute 후 채움 -->
