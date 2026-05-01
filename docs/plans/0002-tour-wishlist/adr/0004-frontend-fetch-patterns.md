# 0004. 세 가지 fetch 패턴 배치 및 무한 스크롤·Suspense 전략

- 상태: 승인됨
- 일자: 2026-05-01

## Context

학습 목적상 한 기능 안에서 `useInfiniteQuery` / RSC fetch / `useSuspenseQuery` 세 패턴을 배치해 비교한다. 각 페이지에 어떤 패턴을 쓸지, 무한 스크롤·Suspense boundary·optimistic update를 어떻게 구성할지 결정해야 한다.

## Options & Decision

### 1) 페이지별 패턴 배치

| 페이지 | 패턴 | 이유 |
|---|---|---|
| `/tour` | `useInfiniteQuery` (client) | 키워드 입력에 따라 동적 refetch + 무한 스크롤. 클라 인터랙션 중심 |
| `/tour/[contentId]` | RSC fetch + `generateMetadata` | 정적, SEO 필요, 초기 페인트 빠름 |
| `/my/wishlist` | `useSuspenseQuery` (client + Suspense) | 로그인 후 진입, Suspense boundary로 로딩 처리 깔끔 |

### 2) 무한 스크롤

- **결정**: `IntersectionObserver`를 직접 `useRef + useEffect`로 구현. `react-intersection-observer` 라이브러리 미도입.
- 학습 목적상 `useInfiniteQuery`의 `fetchNextPage`/`hasNextPage`/`isFetchingNextPage`와 직접 결합하는 흐름을 손으로 짜본다.
- `@tanstack/react-virtual`은 YAGNI(현재 페이지 크기로 가상화 불필요).

### 3) `/tour` URL 상태 동기화 + debounce

- 검색 키워드는 URL searchParam(`?keyword=...`)으로 유지. `useSearchParams` + `router.push`로 input 변경 시 URL 업데이트.
- **300ms debounce** 적용 — 매 키 입력마다 router.push + refetch 폭주 방지. `useDeferredValue` 또는 직접 setTimeout 훅 중 학습 가치는 후자.
- 새로고침·공유 가능, useInfiniteQuery 키도 keyword를 반영해 자동 분기.

### 3-1) staleTime / 캐시 정책

- 글로벌 default(`providers/queryClient.ts`)를 따른다 — TanStack Query 컨벤션 §2(전역 default 존중).
- 다만 외부 API 호출 부담을 고려해 `tourKeys.search(keyword)`만 `staleTime: 30_000`(30초) override 허용. 동일 keyword 연타 시 백엔드 부담 완화.
- 예외적 override이므로 ADR에 근거를 남기고, 다른 쿼리에는 적용하지 않는다.

### 4) `/tour/[contentId]` RSC 두 API 병렬

- **결정**: RSC에서 `Promise.all([fetchTourCommon(id), fetchTourIntro(id)])`. 백엔드는 두 엔드포인트(`GET /api/tour/:contentId/common`, `/intro`) 그대로 노출.
- 합치는 BFF 단일 엔드포인트 안 만듦 — 학습 의도상 RSC에서 병렬 fetch 패턴을 직접 경험.
- `generateMetadata`와 `page.tsx`가 동일 fetch를 중복 호출하지 않도록 fetch 함수에 React `cache()` 적용.

### 5) Suspense boundary 위치 + error boundary 폴백

- `/my/wishlist`는 페이지 루트가 아닌 **위시리스트 리스트 컴포넌트 단위**에 `<Suspense fallback={<WishlistSkeleton />}>` 배치. 헤더·필터 등 정적 영역은 즉시 렌더되도록.
- 같은 boundary에 `error.tsx`(또는 `<ErrorBoundary>`)를 둬서 `useSuspenseQuery`가 401(레이스 케이스: 미들웨어 통과 직후 토큰 만료)로 throw할 때 `/login?redirect=/my/wishlist`로 폴백 redirect. 이 폴백이 없으면 사용자가 에러 화면에 갇힘.

### 6) 위시리스트 토글 optimistic update + prefetch 위치

- `useWishlistToggle` 훅 한 곳에서 `onMutate`로 `wishlistKeys.list()` 캐시 낙관적 갱신, `onError`에서 context로 롤백, `onSettled`에서 `invalidateQueries`.
- `/tour` 카드의 ❤️ 상태는 `wishlistKeys.list()`를 미리 prefetch해두고 contentId 매칭으로 표시 — 별도 “포함 여부” 엔드포인트 불필요.
- **prefetch 위치 확정**: 보호 라우트 그룹 layout(`app/(authed)/layout.tsx` 또는 동등 위치)에서 `queryClient.prefetchQuery(wishlistKeys.list())` 1회. layout이 두 보호 페이지(`/tour`, `/my/wishlist`)를 모두 감싸므로 prefetch 중복 없음.

### 7) features 디렉토리 (단일 도메인 — ADR 0001 결정)

```
features/tour/
  api/                         # searchTours, fetchTourCommon, fetchTourIntro,
                               # listWishlist, addWishlist, removeWishlist
  hooks/                       # useTourSearchInfinite, useWishlist, useWishlistToggle
  components/                  # TourCard, TourSearchInput, TourDetailView,
                               # WishlistGrid, WishlistButton
  constants/keys.ts            # tourKeys + wishlistKeys 두 팩토리
  types.ts                     # TourItem, TourDetail, WishlistItem
```

`features/wishlist/`는 만들지 않는다(ADR 0001). `WishlistButton`은 `components/ui/IconToggleButton`을 합성해 mutation·optimistic update만 책임.

### 8) queryKey 팩토리 (`features/tour/constants/keys.ts` 한 파일)

```
tourKeys.all                   ['tour']
tourKeys.search(keyword)       ['tour', 'search', keyword]
tourKeys.detail(contentId)     ['tour', 'detail', contentId]

wishlistKeys.all               ['wishlist']
wishlistKeys.list()            ['wishlist', 'list']
```

두 팩토리가 같은 파일에 공존하지만 키 prefix(`'tour'` vs `'wishlist'`)가 다르므로 캐시 충돌 없음. 무한 쿼리는 `tourKeys.search(keyword)`를 그대로 사용 — `getNextPageParam`은 쿼리 설정으로 분기되므로 별도 키 불필요.

## Consequences

- 세 패턴이 한 기능에 공존 → 직접 비교 학습 가능. 다만 코드 양과 모듈 의존이 한 패턴 통일보다 늘어남(학습 의도라 수용).
- RSC `cache()`로 metadata/page 중복 fetch 제거 학습 포인트 확보.
- 무한 스크롤 직접 구현은 라이브러리 도입 대비 코드 양 약간 ↑, 그러나 IntersectionObserver 동작 학습 가치 ↑.
- 위시리스트 prefetch 의존: `/tour` 페이지 진입 시 `wishlistKeys.list()`도 함께 fetch 필요. layout 또는 페이지 진입 effect에서 처리.
