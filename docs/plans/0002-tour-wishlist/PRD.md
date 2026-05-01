# 관광지 위시리스트 (Tour Wishlist)

## 목표

한국관광공사 공공 API를 백엔드 프록시로 연동하고, 로그인 사용자가 관광지를 위시리스트에 저장·조회할 수 있는 기능. 학습 목적으로 **`useInfiniteQuery` / RSC fetch / `useSuspenseQuery`** 세 가지 데이터 페칭 패턴을 한 기능 안에 배치하여 비교한다.

## 범위 (scope)

- [x] **frontend** — 검색·리스트(useInfiniteQuery + 무한 스크롤), 상세(RSC fetch + generateMetadata), 위시리스트(useSuspenseQuery), 위시리스트 토글 UI, **SiteHeader nav 메뉴 추가(로그인 시만 노출)**, **Next middleware 라우트 가드**
- [x] **backend** — 한국관광공사 API 프록시, 위시리스트 CRUD, 메타데이터 스냅샷 저장
- [ ] **infra** — 해당 없음 (로컬 도커만)

## 보안 민감도

- [x] 인증 / 세션 / 로그인 — 위시리스트는 로그인 사용자만 접근
- [x] 권한 / RBAC / 접근 제어 — 본인 위시리스트만 조회·수정·삭제
- [x] PII / 시크릿 / 자격증명 — 한국관광공사 API 키는 백엔드 env에만 보관
- [ ] 결제 / 금융 데이터
- [x] 외부 입력 → DB/쿼리 — 검색 키워드, contentId 등 외부 입력 검증

## 완료 기준 (Done)

- [ ] **/tour** — 키워드 검색 + 무한 스크롤로 관광지 리스트 표시 (`useInfiniteQuery`, client component)
- [ ] **/tour/[contentId]** — 관광지 상세 페이지 (RSC fetch, `generateMetadata`로 SEO)
- [ ] **/my/wishlist** — 위시리스트 페이지 (`useSuspenseQuery`, Suspense boundary)
- [ ] 관광지 카드의 위시리스트 토글(❤️) — optimistic update로 즉각 반응
- [ ] 백엔드 엔드포인트: `GET /api/tour/search`, `GET /api/tour/:contentId`, `GET/POST/DELETE /api/wishlist`
- [ ] 본인 위시리스트만 조회·수정 가능 (인증 + 권한 검증)
- [ ] 위시리스트 추가 시 메타데이터 스냅샷(title, firstimage, addr1) DB 저장 — 외부 데이터 변동에도 사용자 데이터 유지
- [ ] 한국관광공사 API 키는 백엔드 env(`TOUR_API_KEY`)로만 관리, 프론트 노출 금지
- [ ] 검색어/contentId 입력 검증 (길이 제한, 형식 체크)
- [ ] **SiteHeader에 "관광지"(/tour), "위시리스트"(/my/wishlist) 메뉴 추가** — `navItems`에 `requiresAuth` 플래그 도입, `useMe`로 로그인 상태일 때만 렌더
- [ ] **Next.js middleware 라우트 가드** — 보호 경로: `/tour`, `/tour/:contentId`, `/my/:path*`. `access_token` 쿠키 미존재 시 refresh 시도 후 실패하면 `/login?redirect=<원래경로>`로 리다이렉트

## 비범위 (이번에 안 함)

- 위시리스트 폴더/태그/공유 기능
- 추천 알고리즘
- 프로덕션 배포 (로컬 도커 only, 개발 단계 학습용)
- 외부 API 데이터 정기 동기화 (호출 시점에만 fetch)
- 캐싱 전략 (단순 프록시 호출, TTL/Redis 없음)
- E2E 테스트 (단위/통합만)

## 참고

- 한국관광공사 API: https://www.data.go.kr/data/15101578/openapi.do (KorService2)
- 활용 엔드포인트:
  - `searchKeyword2` — `/tour` 키워드 검색 + 무한 스크롤 데이터 소스
  - `detailCommon2` + `detailIntro2` — `/tour/[contentId]` 상세 페이지 (RSC에서 두 호출 병렬 fetch, 학습 포인트)
- API 키 환경변수: `TOUR_API_KEY` (Decoding 키, axios가 자동 인코딩)
- env validation(`backend/src/config/env.validation.ts`)에 `TOUR_API_KEY: Joi.string().required()` 추가 필요 — execute 단계에서
- 기존 auth 모듈: `backend/src/auth/`, `frontend/features/auth/`
- TanStack Query 컨벤션: `docs/conventions/tanstack-query-conventions.md`
- TDD 컨벤션: `docs/conventions/tdd-conventions.md`
