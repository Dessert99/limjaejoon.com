# 0008. 테스트 전략 (백엔드 단위, 프론트 Vitest+MSW, 보안 회귀 시나리오)

- 상태: 승인됨
- 일자: 2026-04-26

## Context
PRD가 백엔드는 단위(Jest, co-located `.spec.ts`), 프론트는 Vitest 단위·통합(`frontend/tests/` 미러)만 요구. E2E·Testcontainers 비범위. 어떤 레이어를 어떻게 커버할지 명시한다.

## Options

### 백엔드 통합
- **A1. 서비스 단위만(Repository mock)**
- **A2. SQLite in-memory + TestingModule** — Postgres 방언 차이 위험
- **A3. Testcontainers + 실제 Postgres** — Docker 필요

### 프론트 인터셉터
- **B1. `vi.spyOn` 직접**
- **B2. `axios-mock-adapter`**
- **B3. MSW**

## Decision

### 백엔드: A1 (서비스 단위 + 가벼운 컨트롤러 통합 1개)
- 위치: `backend/src/auth/*.spec.ts` co-located
- Repository(`UserRepository`, `RefreshTokenRepository`)는 `jest.fn()` mock
- `JwtService`는 가능 시 mock(테스트 속도 우선), bcrypt는 일부 시나리오에서 실제 호출(timing 검증용)
- 컨트롤러 통합 1개: `Test.createTestingModule` + `supertest` — 가드·파이프·CORS 동작 + 쿠키 옵션 헤더 어서션

### 백엔드 필수 시나리오
**기본**:
- `signup`: 중복 이메일 → 409
- `login`: 비번 불일치 → 401, 사용자 없음 → 401, 성공 → 토큰 발급
- `refresh` 회전: 정상 회전, 이전 hash `revoked_at` 세팅
- `refresh` 재사용 감지: 이미 `revoked_at != null`인 hash → 같은 family 모두 폐기 + 401
- `refresh` 만료: `expires_at < now` → 401
- `logout`: 현재 hash만 폐기, 다른 family 영향 없음

**보안 회귀**:
- **로그인 timing**: 존재 사용자 vs 미존재 사용자 응답 시간 차 ±20ms 이내(wall clock 측정). dummy bcrypt 호출 정상 동작 검증 (단순 호출 여부가 아닌 실제 시간 비교)
- **family 격리**: 디바이스 A의 family 폐기가 디바이스 B의 family에 영향 없음
- **만료 access + 유효 refresh**: `/auth/refresh`는 정상 통과(access 검증과 분리됨)
- **회전 race**: 같은 raw refresh가 동시에 2번 들어오면 atomic UPDATE로 1번만 회전, 2번째는 재사용 감지 분기로
- **쿠키 옵션 문자열 어서션**: 응답 `Set-Cookie` 헤더 문자열에 `HttpOnly`, `Secure`(prod), `SameSite=Lax`, `Path=/` 토큰 포함 검증. 로그아웃 응답에서는 access·refresh 양쪽 `Max-Age=0` 검증
- **CORS preflight**: `OPTIONS` 요청에 `Access-Control-Allow-Credentials: true`, `Access-Control-Allow-Origin: <FRONTEND_ORIGIN>` 응답
- **env 검증 fail-fast**: 짧은 시크릿·동일 시크릿·미달 round로 부팅 시도 시 startup 실패(별도 스폿 테스트, ADR 0003 정합)

### 프론트: B3 (MSW + Vitest)
- 위치: `frontend/tests/` 미러 (`features/auth/api/*.test.ts`, `features/auth/hooks/*.test.ts`, `lib/api/client.test.ts`, `lib/auth/safeReturnTo.test.ts`, `lib/auth/verifySession.test.ts`)
- 단위(빠름): 폼 검증 함수, 훅 상태 전환은 `vi.mock`으로 api 함수 모킹
- 통합: MSW로 백엔드 엔드포인트 핸들러 등록. axios client 그대로 사용
- 인터셉터의 사전 refresh 분기: `vi.useFakeTimers()` + `tokenStore.setAccessExpiresAt()`로 시간 조작 + MSW로 `/auth/refresh` 호출 횟수 검증
- 동시 mutex: `Promise.all([client.get('/x'), client.get('/y')])` 같은 tick 발사 → MSW 핸들러 호출 횟수 정확히 1

### 프론트 필수 시나리오
**기본**:
- `LoginForm`: 빈 입력·짧은 비번 검증 (8자 미만)
- `useMe`: 401 응답 시 retry 없음, 200 시 user 캐시
- 인터셉터 사전 refresh: `accessExpiresAt`이 미래(60s 초과) → refresh 안 함, 임박 → refresh 먼저
- 인터셉터 401 fallback: 사전 refresh 후에도 401 → 1회 fallback, 또 실패 → `clearAuth` + `clear` + `/login`
- 동시 요청 mutex: refresh 1회만
- 로그아웃 mutation: `tokenStore.clearAuth` + `queryClient.clear` + `router.push('/login')`

**보안 회귀**:
- **`/auth/refresh` 자체 5xx 실패**: `refreshPromise`가 `null`로 초기화되어 다음 요청에서 다시 시도 가능(영구 잠금 없음)
- **`/auth/refresh` 자체 401 무한 루프 방지**: 인터셉터 사전 분기에서 `/auth/refresh` 제외, 401 fallback의 `_retry` 플래그 둘 다 동작
- **`safeReturnTo` 검증**: `//evil.com`, `\\\\evil.com`, `https://evil.com`, `javascript:...`, 빈 문자열, `/login` 등 모두 `/`로 fallback. `/me`, `/posts/123` 같은 정상 path는 그대로 통과
- **`verifySession` 헬퍼**: fetch mock + redirect mock으로 — 쿠키 없음 → redirect, 401 → redirect, 200 → User 반환. 같은 요청 dedup(React.cache 동작) 검증은 통합 단계 비범위
- **로그인 success returnTo 적용**: 쿼리스트링 `?returnTo=/protected/foo` → `router.push('/protected/foo')`, 악성 returnTo → `/`

### QueryClient 인스턴스 격리
각 테스트마다 `new QueryClient({ defaultOptions: { queries: { retry: false } } })` 새로 생성. `renderHook(..., { wrapper })`.

### 토큰 store 초기화
`beforeEach(() => { tokenStore.clearAuth() })` — 모듈 변수라 누수 방지.

## Consequences
**얻는 것**: 빠른 테스트 사이클. MSW로 axios·fetch 양쪽 가로채 확장 좋음. 외부 인프라 의존 없음. 보안 회귀가 단위 테스트에서 잡힘.

**잃는 것**:
- 백엔드: 실제 SQL·마이그레이션 경로 미검증. TypeORM 쿼리 빌더 오타 통과
- 프론트: jsdom은 `httpOnly` 격리·`Set-Cookie` 동작을 실제로 시뮬레이션 못 함 — 백엔드 측 헤더 문자열 어서션으로 부분 보완. 쿠키 보안 동작 자체는 추후 E2E
- MSW로는 실제 백엔드 응답·Set-Cookie와의 정합 미검증

함정 메모:
- 모듈 변수 store + 동시성 테스트는 격리에 특히 민감 — `beforeEach` 누락 시 다른 테스트의 진행 중 `refreshPromise` 봄
- `bcrypt` mock 시 timing 동작 검증 못 함 — login의 dummy compare는 별도 시나리오로 실제 `bcrypt.compare` 호출
- `useFakeTimers`와 MSW 조합 시 timer flush 누락 주의 — `vi.advanceTimersByTime()` 명시적 호출

## Learnings
<!-- /execute 후 채움 -->
