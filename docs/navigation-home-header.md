# Navigation + Home Header 설계 노트

## 1) 목적

이 문서는 전역 헤더와 홈 검색 전환 구조를 왜 이렇게 설계했는지 빠르게 복기하기 위한 기록이다.
현재 버전은 블로그 중심 라이트 에디토리얼 스타일 기준으로 정리한다.

## 2) 책임 분리

- `app/layout.tsx`:
  - Server Component로 유지한다.
  - 모든 페이지에서 공통으로 `SiteHeader`를 렌더한다.
  - 헤더가 `fixed`이므로 본문에 기본 상단 여백(`pt-[72px]`)을 준다.
- `features/navigation/components/SiteHeader.tsx`:
  - Client Component로 둔다.
  - 스크롤 상태(`scrollY >= 72`)와 현재 경로를 기반으로 헤더 UI를 전환한다.
- `features/navigation/components/HeaderNav.tsx`:
  - 메뉴 렌더/활성화 계산을 담당한다.
- `features/navigation/components/HomeSearchShell.tsx`:
  - 홈에서만 보이는 1차 검색 UI를 담당한다.
  - 실제 검색 로직은 아직 연결하지 않는다.

## 3) 전환 규칙

- 홈(`pathname === '/'`)에서만 검색 2행을 렌더한다.
- 홈에서 스크롤이 `72px` 이상이면:
  - nav를 숨기고 검색창을 1행 중앙에 배치한다.
- 비홈 페이지에서는:
  - nav만 유지한다.
  - 검색 2행과 스크롤 전환 로직은 비활성 상태로 둔다.

## 4) UI 배치 규칙

- 헤더 기본 구조: `좌 로고 / 중 검색(or 네비) / 우 유틸`
- 컨테이너 최대 폭: `1200px`
- 헤더 배경: 불투명 아이보리(blur 사용 안 함)

## 5) 성능 규칙

- 스크롤 이벤트에서는 임계값 교차 시점에만 상태를 갱신한다.
- 레이아웃 비용이 큰 속성 애니메이션(`height`, `max-height`)은 피한다.
- 홈 임계점에서 깜빡임/점프가 없는지 수동 검증한다.

## 6) URL 정책

- 정식 handbook 경로:
  - `/handbook`
  - `/handbook/[slug]`
- 레거시 호환:
  - `/category/[slug]` 접근 시 `/handbook/[slug]`로 리다이렉트한다.
