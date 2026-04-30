# 0004. 사전(Proactive) 토큰 재발급 메커니즘

- 상태: 승인됨
- 일자: 2026-04-26

## Context
access 토큰을 httpOnly 쿠키로 보관하면 클라이언트 JS가 만료 시각(`exp`)을 읽을 수 없다. PRD는 "401 인터셉터 후 재시도"가 아닌 사전 재발급을 요구한다. 만료 시각 전달, 동시 다중 요청 시 중복 refresh 방지, 실패 처리를 결정한다.

## Options

### 만료 시각 전달
- **A1. 응답 body에 `accessExpiresAt`(epoch ms) 포함** — 토큰 자체 노출 없음
- **A2. 별도 엔드포인트** — 라운드트립 추가
- **A3. non-httpOnly 쿠키로 만료 시각만 노출** — 쿠키 두 종류 관리

### 동시성
- **B1. 모듈 변수 + Promise singleton** — 의존성 0
- **B2. axios-auth-refresh** — 의존성 1, YAGNI

### Store 위치
- **C1. 모듈 레벨 변수(`lib/api/tokenStore.ts`)** — 단순. axios client는 브라우저 번들 전용이라 SSR 오염 없음
- **C2. Zustand** — DevTools 가시성 ↑, 의존성 추가
- **C3. TanStack Query 캐시** — 동기 접근 어색

## Decision

**A1 + B1 + C1.** 토큰 자체는 절대 body에 포함하지 않음.

### 흐름
```
// frontend/lib/api/tokenStore.ts
let accessExpiresAt: number | null = null
let refreshPromise: Promise<void> | null = null
export const setAccessExpiresAt = (v: number) => { accessExpiresAt = v }
export const clearAuth = () => { accessExpiresAt = null; refreshPromise = null }
export const getAccessExpiresAt = () => accessExpiresAt

// frontend/lib/api/client.ts (요지)
client.interceptors.request.use(async (config) => {
  if (config.url === '/auth/refresh') return config         // 무한 루프 방지
  const exp = getAccessExpiresAt()
  if (exp && Date.now() + 60_000 >= exp) {
    if (!refreshPromise) {
      refreshPromise = client.post('/auth/refresh')
        .then(r => setAccessExpiresAt(r.data.accessExpiresAt))
        .catch(e => { throw e })                            // reject는 호출부로
        .finally(() => { refreshPromise = null })
    }
    try { await refreshPromise } catch { /* 401 fallback이 처리 */ }
  }
  return config
})

client.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry && original.url !== '/auth/refresh') {
      original._retry = true
      try {
        const r = await client.post('/auth/refresh')
        setAccessExpiresAt(r.data.accessExpiresAt)
        return client(original)
      } catch {
        clearAuth(); queryClient.clear(); router.push('/login')
        return Promise.reject(err)
      }
    }
    return Promise.reject(err)
  }
)
```

### 핵심 규칙
- **threshold 60s**: `now + 60s >= accessExpiresAt`이면 사전 갱신. 15분 TTL 대비 1분 여유는 시계 오차 + RTT 흡수에 충분
- **`/auth/refresh` 자기 자신**은 인터셉터 사전 분기 + 401 fallback에서 모두 제외(무한 루프 방지)
- **`_retry` 플래그**: 401 fallback은 원 요청당 1회만. fallback의 refresh 자체가 또 401이면 즉시 로그아웃 흐름
- **mutex 영구 잠금 방지**: `refreshPromise`는 `finally`에서 반드시 `null`. reject는 `await`에서 catch해서 401 fallback으로 흘림

### 401 fallback 종료
사전 refresh 실패 또는 fallback 후에도 401이면 `clearAuth()` + `queryClient.clear()` + `/login` 이동. 이때 `returnTo`를 쿼리스트링에 담을 경우 ADR 0005의 검증 규칙 적용.

## Consequences
**얻는 것**: 외부 의존성 0. SSR 오염 없음. 페이지 새로고침 시 메모리 초기화로 첫 요청은 항상 refresh 우선(부하 미미, 의도된 동작). 동시 N개 요청 → refresh 1회. mutex가 reject되면 자연스럽게 401 fallback으로 흘러 영구 잠금 없음.

**잃는 것**: 새로고침마다 refresh 1회 추가. 모듈 변수라 테스트마다 `clearAuth()` 초기화 필요. DevTools 가시성 ↓.

### 보안 함정 (XSS 시 신뢰 경계)
- `accessExpiresAt`은 단순 epoch 숫자. XSS로 읽혀도 토큰을 못 가져감(httpOnly가 본질 방어)
- 공격자가 임의로 `setAccessExpiresAt(Number.MAX_SAFE_INTEGER)` 호출하면 사전 refresh가 영원히 안 일어나 만료 시점까지 401만 반복 — 401 fallback이 최종 안전망
- **클라이언트가 `accessExpiresAt`을 신뢰하는 것은 보안 결정이 아니라 UX 최적화**. 서버는 항상 토큰의 `exp`로 진실. 위변조해도 401이 잡음
- XSS 자체가 더 큰 공격이라 store 자체에 별도 mitigation 불필요(트레이드오프 인지)

### 일반 함정
- `refreshPromise` `null` 초기화 누락 → 한 번 실패 후 영구 잠금
- `/auth/refresh` 인터셉터 분기 누락 → 무한 루프
- `_retry` 플래그 누락 → 401 fallback이 무한 루프 (원 요청 → 401 → refresh 시도 → 401 → 또 시도 ...)
- `Date.now()` 클라이언트 시계 의존 — threshold 60s가 보호장치

## Learnings
<!-- /execute 후 채움 -->
