# 0005. Server Component 인증 검증 (middleware vs SC, refresh·Set-Cookie 비포함, redirect 검증)

- 상태: 승인됨
- 일자: 2026-04-26

## Context
Next.js 16 App Router에서 보호 라우트(`/me` 등) SSR 인증 정책. middleware와 Server Component(SC)의 책임 분리, SSR에서 refresh/Set-Cookie 처리 정책, redirect 타깃의 open redirect 방어를 결정한다.

## Options
- **A. middleware에서 JWT 직접 검증(jose)** — Edge runtime 검증, 시크릿이 Edge로 노출
- **B. middleware = 쿠키 존재 체크만, SC에서 백엔드 `/auth/me` 호출** — 1차 빠른 필터 + 2차 정확한 게이트
- **C. middleware 생략, 모든 SC에서 직접 검증** — middleware 의미 없음

## Decision

**B 채택.**

### 책임 분리
- `frontend/middleware.ts`: 보호 경로 매처에서 `request.cookies.get('access_token')` **존재 여부만** 체크. 없으면 `redirect('/login')`. **만료/유효성 검증 안 함**
- `frontend/lib/auth/verifySession.ts`: `React.cache()`로 감싼 헬퍼. `cookies()` → `Cookie` 헤더로 백엔드 `/auth/me` 호출(native `fetch`, `cache: 'no-store'`). 401이면 `redirect('/login')`. 성공 시 `User` 반환
- 보호 라우트 `page.tsx` 또는 `(protected)/layout.tsx`: 진입 시 `await verifySession()`. 같은 요청 내 dedup은 `React.cache`로

### middleware matcher (allowlist)
정적 자산이 매처를 거치면 redirect 사고 위험. `config.matcher`를 allowlist 방식으로 명시:
```ts
export const config = {
  matcher: [
    // 보호 경로만 명시. 정적 자산·api·_next 제외
    '/me/:path*',
    '/(protected)/:path*',
  ],
}
```
또는 negative lookahead 패턴으로 `/((?!_next/|api/|favicon.ico|.*\\..*).*)` 식 제외 — 다만 보호 경로만 명시하는 allowlist가 더 안전.

### SSR refresh·Set-Cookie 비포함 (Critical)
- SSR에서는 refresh **시도하지 않음**. 만료된 access는 `redirect('/login')`
- 백엔드 `/auth/me` 응답에 `Set-Cookie`가 있어도 **SSR이 클라이언트로 forward하지 않음**. 만료면 redirect만. 이 정책은 응답 forwarding을 의도적으로 차단해 사용자 세션 어긋남 방지
- 전달은 정확히 `Cookie` 헤더 1개만. 쿠키 값은 httpOnly로 사용자 입력이 닿지 않으므로 헤더 인젝션 위험은 낮으나, **백엔드 `/auth/me`는 한 번 더 쿠키 형식 검증** (CRLF·길이 등)
- 유효 refresh + 만료 access를 가진 사용자도 SSR에서 `/login`으로 강제 — 클라이언트로 떨어진 후 axios 인터셉터의 사전 refresh가 정상 처리. 의도된 트레이드오프이며 추후 SSR refresh forwarding은 별도 plan에서 검토

### Redirect 타깃 검증 (Open Redirect 방어)
`/login`으로 보낼 때 `?returnTo=<원래 경로>`를 쿼리스트링에 담는 패턴. **검증 없이 사용 시 open redirect 취약**. 검증 규칙:

1. `returnTo`는 **반드시 `/`로 시작**
2. **`//`로 시작 금지** (protocol-relative URL은 외부 도메인으로 인식됨)
3. `\` 또는 `\\` 포함 금지
4. URL 형식이 아닌 경로(path-only)만 허용
5. 화이트리스트 prefix 정규식: `^\/(?!\/)([\w\-./?=&%]*)$`
6. 미달 시 `/`로 fallback

이 정책은:
- middleware의 `/login` redirect
- SC `verifySession`의 `/login` redirect
- 클라이언트 401 fallback의 `/login` 이동(ADR 0004)
- 로그인 success 후 `router.push(returnTo ?? '/')` (ADR 0007)

**모든 곳에서 동일하게 적용.** 헬퍼 `safeReturnTo(input: string | null): string`를 `lib/auth/safeReturnTo.ts`에 두고 단일 진실.

### RootLayout 호출 금지
`verifySession()`을 `app/layout.tsx`에서 호출하지 않음. `cookies()`가 dynamic 렌더링을 강제하므로 RootLayout에서 호출 시 모든 페이지가 dynamic으로 변함. 보호 라우트 `page.tsx` 또는 `app/(protected)/layout.tsx`에서만 호출.

### 클라이언트 user 상태 동기화
SC에서 받은 `User`는 hydrate 후 `useMe`(`['auth','me']`)와 별개 상태. 첫 mount 시 `useMe`가 한 번 fetch해 일치 확인. 자세한 패턴은 ADR 0007.

## Consequences
**얻는 것**: middleware 가벼움. 시크릿이 백엔드에만 머물러 공격 표면 작음. SC가 백엔드 응답을 단일 진실로 신뢰. open redirect 차단. SSR에서 응답 쿠키 forwarding으로 인한 세션 race 사고 0.

**잃는 것**: 만료된 쿠키 가진 비정상 요청은 middleware 통과 후 SC에서 redirect(2단 검증 비용). 보호 페이지 첫 로드마다 백엔드 `/auth/me` 1회(인증된 사용자 모두 부담) — `React.cache`로 같은 요청 내 dedup. 유효 refresh + 만료 access도 SSR에서 강제 로그아웃(추후 plan 가능성).

함정 메모:
- `cache: 'no-store'` 누락 시 Next.js가 응답 캐시 → 다른 사용자에게 같은 결과
- `cookies()`는 dynamic API
- `safeReturnTo` 헬퍼를 우회하면 open redirect 재발 — 새 redirect 추가 시 코드 리뷰에서 반드시 확인
- middleware matcher가 보호 경로 외에 매칭되면 정적 자산 응답이 redirect로 깨짐

## Learnings
<!-- /execute 후 채움 -->
