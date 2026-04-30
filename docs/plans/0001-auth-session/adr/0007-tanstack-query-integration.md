# 0007. TanStack Query 통합 패턴

- 상태: 승인됨
- 일자: 2026-04-26

## Context
TanStack Query 도입. `QueryClient` 위치, Provider 마운트, 쿼리 키 컨벤션, 캐시 정책, 로그아웃·로그인 시 캐시 처리, returnTo 처리를 정한다.

## Options

### Provider 위치
- **A1. `app/layout.tsx`에서 직접** — RootLayout이 SC라 `'use client'` 분리 필요
- **A2. `app/providers.tsx` ('use client')** — Next.js App Router 관례. layout이 import해서 wrap
- **A3. `features/shared/components/Providers.tsx`** — 도메인 1개뿐인데 shared는 이른 추상화

### 로그아웃 시 캐시 처리
- **B1. `invalidateQueries()`** — 백그라운드 refetch, 401 폭탄
- **B2. `resetQueries()`** — 즉시 재요청
- **B3. `clear()`** — 모든 캐시 즉시 제거

### 로그인/가입 mutation 후
- **C1. `invalidateQueries(['auth','me'])`** — 추가 fetch
- **C2. `setQueryData(['auth','me'], user)`** — 라운드트립 0

## Decision

**A2 + B3 + C2.**

### Provider
`frontend/app/providers.tsx`:
```tsx
'use client'
const Providers = ({ children }) => {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  }))
  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
```
`app/layout.tsx`(SC)에서 `<Providers>{children}</Providers>`로 wrap. `features/shared/`는 도메인 2번째 생길 때 도입.

### 쿼리 키 컨벤션
`['<feature>', '<resource>', ...args]` 형태. 인증은 `['auth', 'me']`.

### useMe 옵션
- `queryKey: ['auth', 'me']`
- `queryFn: getMe`
- `staleTime: 5 * 60 * 1000` — 5분(휴리스틱). access TTL(15분)과 직접적 인과는 없음. 보호 페이지 빈번 이동 시 useMe 자동 refetch 빈도를 조절하는 값. 너무 짧으면 트래픽 ↑, 너무 길면 권한 변경(미래) 반영 지연
- `retry: false` — 401은 재시도 무의미. 인터셉터·fallback이 처리
- `enabled`: 기본 true. 비로그인 라우트에서는 호출 안 함(보호 라우트만 `useMe` 사용)

### 로그아웃
1. `useLogout`의 `mutationFn`이 `/auth/logout` 호출 성공
2. `tokenStore.clearAuth()` (ADR 0004)
3. `queryClient.clear()` — 모든 캐시 일괄 제거
4. `router.push('/login')` (returnTo는 로그아웃에서 사용 안 함)

### 로그인/가입
1. mutation success: 응답 `{ user, accessExpiresAt }`
2. `tokenStore.setAccessExpiresAt(accessExpiresAt)`
3. `queryClient.setQueryData(['auth', 'me'], user)`
4. `router.push(safeReturnTo(searchParams.get('returnTo')))` — **반드시** `safeReturnTo` 헬퍼 통과(ADR 0005). 미달이면 `/`로 fallback

### 다른 도메인 추가 시 `clear()` 재검토
현재 도메인이 auth뿐이라 `clear()`가 가장 안전. 미래에 인증 무관 캐시(예: 공개 게시글 목록)가 생기면 `removeQueries({ queryKey: ['auth'] })` + 사용자별 데이터 명시 폐기로 좁힘. 그때 ADR 추가.

### Server Component 검증과 클라이언트 useMe 관계
보호 라우트는 SC `verifySession`(ADR 0005)이 이미 검증·`User` 반환. hydrate 후 `useMe`가 한 번 fetch해 같은 결과 채움. SSR `dehydrate`/`HydrationBoundary` 패턴은 비범위 — 인증 데이터는 사용자별이라 prefetch 이득 작음, 짧은 loading 상태 허용.

## Consequences
**얻는 것**: 새 사용자 로그인 시 이전 사용자 캐시 잔존 0. 로그인/가입 후 즉시 UI 반영(추가 fetch 없음). 쿼리 키 컨벤션이 명확해 IDE 검색·디버깅 쉬움. open redirect는 `safeReturnTo`로 차단.

**잃는 것**: `clear()`는 다른 도메인 캐시도 모두 날림 — 다른 도메인 추가 시 좁힐 필요. SSR 하이드레이션 미사용으로 보호 라우트 진입 시 짧은 loading 가능성(허용 범위).

함정 메모:
- `QueryClient`는 컴포넌트 안에서 `useState`로 1회만 생성 — 모듈 레벨에 두면 SSR 인스턴스 공유로 사용자 간 데이터 누설
- `setQueryData` 시 응답 형태가 `useMe` 반환 타입과 정확히 일치해야 함
- 테스트에서 `QueryClient`는 매 테스트 새 인스턴스 — ADR 0008
- `safeReturnTo` 우회 시 open redirect 재발 — `router.push` 직전 항상 통과

## Learnings
<!-- /execute 후 채움 -->
