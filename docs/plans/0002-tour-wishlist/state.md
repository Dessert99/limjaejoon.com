# 작업 상태

## 기능명

관광지 위시리스트 (Tour Wishlist) — 한국관광공사 KorService2 API 프록시 + 사용자 위시리스트 CRUD. 학습 목적: `useInfiniteQuery` / RSC fetch / `useSuspenseQuery` 세 fetch 패턴 비교, NestJS 외부 API 프록시·DB 저장, Next.js middleware 라우트 가드.

## 관련 문서

- PRD: `docs/plans/0002-tour-wishlist/PRD.md`
- ADR:
  - `adr/0001-module-boundaries.md` — tour / wishlist 도메인 분리
  - `adr/0002-external-api-client-and-acl.md` — `@nestjs/axios` + service ACL
  - `adr/0003-wishlist-db-schema.md` — 평탄화 스냅샷 컬럼 + IDOR 차단 규약
  - `adr/0004-frontend-fetch-patterns.md` — 페이지별 fetch 패턴 + 무한 스크롤 + Suspense
  - `adr/0005-nav-and-route-guard.md` — SiteHeader nav + Next middleware 가드
  - `adr/0006-types-validation-error-contract.md` — 타입 동기화 + ValidationPipe + 에러 형상

## 현재 단계

- [x] PRD 작성
- [x] ADR 초안 (6개)
- [x] ADR 검토 (architect-reviewer + security-auditor) — 피드백 반영 완료
- [ ] 구현
- [ ] 코드 검토 (code-reviewer + security-auditor + accessibility-tester)
- [ ] 회고 (study-note)

## 자동 라우팅 결과

- 도메인: **`nextjs-developer`** (frontend), **`node-specialist`** (backend)
- 보안 검토: **필요** (PRD 보안 민감도 4개 체크 — 인증/세션, 권한/RBAC, 시크릿, 외부 입력 → DB)
- 접근성 검토: **필요** (frontend 범위 — execute 단계에서 호출)

## 마지막 작업 요약

ADR 6개 작성·검토 완료. 검토 피드백(타입 동기화, IDOR 차단, 캐시 누설, 에러 누설, debounce 등) 반영 완료. 구현 대기.

## 다음 액션

`/execute 0002-tour-wishlist`로 새 세션에서 시작. execute 첫 라운드 작업 단위:

1. **백엔드 선결**:
   - `env.validation.ts`에 `TOUR_API_KEY: Joi.string().required()` 추가
   - `main.ts`의 `ValidationPipe` 전역 등록 상태 검증 (없으면 추가, ADR 0006)
   - **회귀 검증**: `forbidNonWhitelisted: true` 옵션이 추가되면 기존 `auth/users` 요청 페이로드 중 DTO에 정의되지 않은 필드는 모두 400으로 거부됨. 기존 `LoginDto`/`SignupDto`/`RefreshDto` 필드와 클라이언트(`useLogin`/`useSignup`) 페이로드 일치 확인 + 기존 `auth.service.spec.ts` 통과 확인 (ADR 0006)
2. **백엔드 tour 모듈 생성** (TDD):
   - `HttpModule.registerAsync` 등록 + `serviceKey` 인터셉터 (ADR 0002)
   - `TourService.searchByKeyword(keyword, page)` 반환 envelope `{ items, page, hasMore }` (ADR 0006)
   - `fetchCommon(contentId)`, `fetchIntro(contentId)` + ACL mapper
   - `TourController` GET `/api/tour/search`, GET `/api/tour/:contentId/common`, GET `/api/tour/:contentId/intro`
   - 503 변환 시 에러 누설 방지 검증 (ADR 0002)
   - **logger 시리얼라이저 단위 테스트 1개**: 외부 API 에러를 logger에 흘렸을 때 출력 문자열에 `serviceKey`/`config.url`이 포함되지 않는지 검증 (ADR 0002의 마스킹이 코드로 강제됨을 회귀 방지)
3. **백엔드 wishlist 모듈 생성** (TDD):
   - `Wishlist` 엔티티 + migration (ADR 0003)
   - `WishlistService` (`userId` 필수 인자, `repo.delete({ id, user_id })` IDOR 차단)
   - `WishlistController` GET/POST/DELETE `/api/wishlist` + `JwtAuthGuard` + `@CurrentUser()`
   - `CreateWishlistDto` (`contentId` 정규식, `title` 길이 제한)
4. **프론트 `features/tour/` 단일 도메인 스캐폴딩** (ADR 0001):
   - `features/tour/types.ts` (백엔드 DTO 수동 미러링: `TourItem`, `TourDetail`, `WishlistItem`)
   - `features/tour/constants/keys.ts` (`tourKeys` + `wishlistKeys` 두 팩토리 공존)
   - `features/tour/api/` (searchTours, fetchTourCommon, fetchTourIntro, listWishlist, addWishlist, removeWishlist)
   - **`frontend/components/ui/IconToggleButton.tsx` 신설** (도메인 비종속 primitive, on/off 토글, `aria-pressed`, 디자인 토큰 기반)
   - `features/tour/components/WishlistButton.tsx` (`IconToggleButton` 합성 + `useWishlistToggle` mutation)
5. **프론트 페이지 구현** (TDD: 훅·인터랙션 컴포넌트):
   - `/tour` `useInfiniteQuery` + IntersectionObserver + 300ms debounce + URL searchParam 동기화 (ADR 0004)
   - `/tour/[contentId]` RSC fetch `Promise.all` + `cache()` + `generateMetadata` (ADR 0004)
   - `/my/wishlist` `useSuspenseQuery` + Suspense + error boundary 401 폴백 (ADR 0004)
   - `useWishlistToggle` optimistic update (TDD 우선 대상)
6. **SiteHeader nav + middleware 가드**:
   - `navItems`에 `requiresAuth` 플래그, `SiteHeader`에서 `useMe` 기반 필터 (ADR 0005)
   - `frontend/middleware.ts` 신설 — 보호 경로 매칭 + access 쿠키 검사 + refresh forwarding
   - `useLogout` `onSuccess`에 `queryClient.clear()` 추가 (ADR 0005)
   - 보호 라우트 layout에서 `wishlistKeys.list()` prefetch (ADR 0004)
7. **검토 라운드**: code-reviewer + security-auditor + accessibility-tester 병렬 호출
8. **회고**: study-note 스킬로 학습 정리 (세션 중 사용자 개념 질문/답변 별도 섹션)

## 건드린 파일

- `docs/plans/0002-tour-wishlist/PRD.md` — 기능 요구사항 + 보안 민감도 + 완료 기준
- `docs/plans/0002-tour-wishlist/adr/0001~0006-*.md` — 6개 결정 문서
- `.env`, `.env.example` — `TOUR_API_KEY` 환경변수 추가 (Decoding 키)

## 미해결 결정 / 질문

- 없음. 모든 결정 사용자 컨펌 완료 (Q1=A 슬롯 합성 / Q2=B throttler 비범위 / 메뉴 두 개 추가 / middleware 가드 / 상세 페이지 가드 포함 / detailCommon2 + detailIntro2).
- execute 첫 작업으로 `ValidationPipe` 전역 등록 상태와 `cookie.config.ts`의 `Domain` 미설정 상태만 빠르게 검증 (둘 다 ADR에 명시).
