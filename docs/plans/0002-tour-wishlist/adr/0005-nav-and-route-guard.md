# 0005. SiteHeader nav 메뉴 + Next.js middleware 라우트 가드

- 상태: 승인됨
- 일자: 2026-05-01

## Context

`/tour`, `/tour/[contentId]`, `/my/wishlist`는 로그인 사용자만 접근 가능해야 한다. (1) SiteHeader에 진입 메뉴를 추가하되 미로그인 시 숨기고, (2) URL 직접 입력으로 우회되지 않도록 가드를 둔다. 사용자 요청: "실무에서 사용하는 방식에 가깝게".

기존 인증 구조:

- 쿠키 두 개: `access_token`(15분), `refresh_token`(7일). 둘 다 httpOnly, sameSite=lax.
- 백엔드 `/auth/refresh`가 refresh 쿠키로 새 access·refresh 발급.
- 프론트 `useMe` hook이 `/auth/me`로 사용자 조회.

## Options

### nav 메뉴 노출

- A. `navItems`에 `requiresAuth` 플래그 추가 → SiteHeader에서 `useMe` 결과로 필터.
- B. SiteHeader 내부에서 메뉴별 조건문 분기.

### 라우트 가드

- C. **Layered defense (실무 베스트)** — Next.js middleware에서 1차 게이트(쿠키 존재 + access 만료 임박 시 자동 refresh), 백엔드 `JwtAuthGuard`가 2차 검증.
- D. 페이지 RSC `page.tsx`에서 `cookies()` + `redirect()` 직접 호출.
- E. 클라이언트 hook(`useMe`)에서 `useEffect` redirect.

## Decision

### nav 메뉴: **A**

`config/navItems.ts`에 `requiresAuth?: boolean` 추가:

```ts
export const navItems: NavItem[] = [
  { label: '지식 모음', href: '/blog' },
  { label: '관광지', href: '/tour', requiresAuth: true },
  { label: '위시리스트', href: '/my/wishlist', requiresAuth: true },
];
```

`SiteHeader`에서 `useMe`의 `data` 존재 여부로 필터. 로딩 중에는 보호 메뉴 자리를 비워둠(CLS 방지를 위해 자리 자체를 차지하지 않게 — flex layout이라 자연스럽게 처리됨).

### 라우트 가드: **C (Layered defense)**

`frontend/middleware.ts` 신설.

**보호 경로 matcher**:

```ts
export const config = {
  matcher: ['/tour/:path*', '/my/:path*'],
};
```

**미들웨어 흐름**:

1. `access_token` 쿠키가 있으면 → 통과 (시그니처 검증은 백엔드 JwtAuthGuard가 함; edge에서 secret 노출 회피).
2. `access_token`이 없고 `refresh_token`이 있으면 → 백엔드 `/auth/refresh`를 fetch로 호출, 응답 Set-Cookie를 NextResponse에 그대로 전달 후 통과. **refresh 호출 자체가 실패(네트워크/백엔드 다운/4xx/5xx)하면 재시도 없이 즉시 3번으로** — 무한 retry·리다이렉트 루프 차단.
3. 둘 다 없거나 refresh 실패 → `NextResponse.redirect(new URL('/login?redirect=<원래경로>', req.url))`.

**쿠키 도메인·Path 일치 확인**: `cookie.config.ts`의 `baseOptions`는 `COOKIE_DOMAIN`이 비어 있으면 `domain` 속성을 생략(Host-only 쿠키), `path`는 `/`. 이 상태가 유지되어야 미들웨어가 forward한 Set-Cookie가 Next.js 호스트의 모든 라우트(`/tour/*` 등)에서 읽힘. **Path가 `/auth` 등으로 좁아지면 access_token이 보호 라우트에서 안 읽혀 매 요청마다 refresh가 트리거되는 사실상의 비효율 루프 발생** — execute 단계에서 도메인·path 둘 다 검증.

**왜 이 방식이 실무적인가**:

- 미들웨어가 모든 보호 경로 진입을 한 곳에서 통제 → 페이지마다 가드 코드 반복 X.
- access 만료 시 미들웨어가 자동 refresh를 처리하므로, 백엔드 JwtAuthGuard가 던지는 401을 클라이언트가 다시 처리할 필요가 거의 없음(이중 안전망은 유지).
- access 토큰 자체의 시그니처 검증은 백엔드에서만 → JWT secret이 edge runtime에 노출되지 않음.
- `redirect=<원래경로>` 쿼리로 로그인 후 원래 가려던 페이지로 복귀 가능 → 기존 `/login` 페이지가 이 쿼리를 읽어 처리.

**비범위 (이번에 안 함)**:

- access 토큰 `exp` claim 직접 디코드해 미리 만료 체크 (jose 도입). 쿠키 존재만으로 충분 — 백엔드 401이 트리거하면 다음 요청 사이클에서 처리됨.
- CSRF 토큰. sameSite=lax + 백엔드 JwtAuthGuard로 충분(현재 API가 모두 JSON, GET은 멱등).

## Consequences

- middleware는 edge runtime에서 실행되므로 Node API(예: `fs`)를 못 씀. 우리 흐름은 fetch만 사용하므로 문제 없음.
- 백엔드 `/auth/refresh` 응답의 Set-Cookie 헤더를 NextResponse에 forward할 때 도메인·path가 동일해야 함 — 기존 `cookie.config.ts`가 동일 옵션을 보장하므로 통과.
- 로그인 페이지(`/login`)가 `redirect` 쿼리를 받아 로그인 성공 시 그쪽으로 이동하도록 한다(이미 구현돼 있다면 검증, 아니면 작은 보완 필요 — execute 단계에서 확인).
- 미들웨어 추가는 모든 매칭 요청에 한 번씩 실행 → matcher 정확히 좁혀야 정적 자산까지 가지 않음. `config.matcher`는 `_next/static`·`favicon.ico` 등을 자동 제외하지 않으므로 매칭 패턴을 좁게 유지.
- nav 메뉴는 `useMe` 캐싱(staleTime/queryClient default)에 의존 → 로그인/로그아웃 직후 메뉴 갱신은 `queryClient.invalidateQueries(authKeys.me())`로 처리하는 기존 흐름 유지.

## 로그아웃 시 캐시 정리 (사용자 전환 시 데이터 누설 방지)

기존 `useLogout` 훅의 `onSuccess`에 **`queryClient.clear()` 호출 추가**. 이유:

- `useSuspenseQuery`로 가져온 `wishlistKeys.list()` 데이터는 메모리 캐시에 잔존한다.
- 동일 브라우저에서 사용자 A가 로그아웃 → 사용자 B 로그인 시, 캐시가 그대로 남아 있으면 B에게 A의 위시리스트가 잠깐 보이는 누설이 발생.
- `invalidateQueries(authKeys.me())`만으로는 다른 도메인 캐시(`wishlistKeys.*`)가 정리되지 않음.
- `queryClient.clear()`는 로그아웃 시 가장 안전한 광범위 정리 — 학습 단계에서도 적용해 패턴을 익힌다.

이 변경은 `features/auth/hooks/useLogout.ts`의 단일 위치에서만 일어나므로 위시리스트 도메인이 auth를 직접 의존하지 않는다(클린).
