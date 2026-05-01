# 0001. 도메인 경계 — 백엔드 모듈 분리 + 프론트 단일 도메인 + UI primitive 분리

- 상태: 승인됨
- 일자: 2026-05-01

## Context

이 기능은 (1) 한국관광공사 외부 API 프록시 조회와 (2) 인증 사용자의 위시리스트 CRUD 두 책임을 다룬다. 모듈 경계를 어떻게 그을지 결정해야 한다.

핵심 관찰: **프론트 `features/`와 백엔드 NestJS `module`은 같은 단위가 아니다.**

- 백엔드 NestJS 모듈은 진짜 의존성 그래프 — `imports`/`exports`로 DI 경계가 강제되고 모듈 단위로 `JwtAuthGuard` 같은 정책이 갈린다.
- 프론트 `features/`는 폴더 분류일 뿐 — `features/A`에서 `features/B`를 import하는 걸 막는 메커니즘이 없다.

따라서 두 단위를 같은 이름으로 정렬할 필연이 없다.

## Decision

### 1) 백엔드 — 모듈 분리

`src/tour/` (외부 API 프록시) + `src/wishlist/` (사용자 CRUD) 두 모듈.

- 단방향 의존: `WishlistModule` → `TourModule` (필요 시. 현재 흐름은 클라이언트가 카드 데이터를 그대로 body로 전달하므로 이 의존조차 거의 없음)
- 모듈별 정책: `tour`는 인증 가드 적용(보호 라우트의 일부지만 컨트롤러 자체는 GET 위주), `wishlist`는 모든 엔드포인트에 `JwtAuthGuard`
- 각 모듈 내부: `controller / service / dto` (+ wishlist만 `entity`)

### 2) 프론트 — `features/tour/` 단일 도메인

`features/tour/`에 tour 검색·상세·위시리스트 토글까지 모두 함께. `features/wishlist/`는 만들지 않는다.

```
features/tour/
  api/                         # searchTours, fetchTourCommon, fetchTourIntro,
                               # listWishlist, addWishlist, removeWishlist
  hooks/                       # useTourSearchInfinite, useWishlist, useWishlistToggle
  components/                  # TourCard, TourSearchInput, TourDetailView,
                               # WishlistGrid, WishlistButton
  constants/keys.ts            # tourKeys, wishlistKeys 두 팩토리 같이
  types.ts                     # TourItem, TourDetail, WishlistItem 미러링
```

이유:

- `TourCard`가 카드 우상단 ❤️로 위시리스트 토글을 수행해야 함(UX 흐름). 분리하면 `features/tour → features/wishlist` 의존이 발생하는데, 폴더 분류상 막을 수단도 없고 막을 가치도 없다.
- 학습 단계에서 슬롯(`actionSlot`)으로 우회 합성하는 것은 의존성 문제 없는 곳에 우회로를 도입하는 과한 설계.
- `TourCard`가 `WishlistButton`을 직접 import해도 같은 폴더 안 결합이라 자연스러움.

### 3) 도메인 비종속 UI primitive — `frontend/components/ui/` 신설

도메인 합성에 쓰일 시각·인터랙션 primitive는 `features/` 밖 단일 위치에 둔다.

```
frontend/
  components/
    ui/                        # 도메인 비종속 primitive
      IconToggleButton.tsx     # on/off 두 상태 토글 버튼 (heart, bookmark 등에 재사용)
      IconToggleButton.css.ts
```

- shadcn-ui / Radix / Headless UI 의 분리 패턴과 일치 — primitive에 시각·a11y만, 행위는 도메인 컴포넌트가 합성.
- 이번 plan에서 만들 primitive는 `IconToggleButton` 하나. `aria-pressed`, 키보드 토글, 디자인 토큰 기반 색상.
- `WishlistButton`(`features/tour/components/`)은 `IconToggleButton`을 합성해 mutation·optimistic update만 책임.
- `frontend/lib/`는 이미 인프라(api client, auth helpers)용으로 자리잡혀 있어 UI primitive와 단위가 다름.
- 향후 cleanup 신호: 기존 `SiteHeader`의 `iconBtn` 스타일은 `IconButton`(non-toggle)으로 추출해 `components/ui/`로 옮길 수 있음 — **이번 plan 범위 밖**.

## Consequences

- 백엔드 두 모듈로 분리되어 있어 모듈 단위 정책·테스트·exports가 명확.
- 프론트 폴더 수가 줄어 학습 단계에서 단순함. 도메인 결합 우려는 features가 폴더 분류일 뿐이라 실질 의미 없음.
- `features/tour/` 안에 tour 도메인 + wishlist 토글이 공존해 한 곳에서 흐름 파악 가능.
- `components/ui/` 신설로 향후 다른 기능에서도 primitive 재사용 가능. 이번 plan은 `IconToggleButton` 하나만 추가, 나머지는 필요할 때.
- 위시리스트가 다른 도메인(예: 프로필)에서 단독으로 쓰일 일이 생기면 `features/wishlist/`로 분가 검토 — 그때 결정 (YAGNI).
