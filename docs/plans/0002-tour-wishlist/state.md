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
  - [x] 백엔드 라운드 1: 선결 + tour 모듈 + wishlist 모듈 (TDD, 테스트 35/35 통과)
  - [ ] 프론트 라운드: features/tour 스캐폴딩 + 페이지 3종 + nav/middleware
- [ ] 코드 검토 (code-reviewer + security-auditor + accessibility-tester)
- [ ] 회고 (study-note)

## 자동 라우팅 결과

- 도메인: **`nextjs-developer`** (frontend), **`node-specialist`** (backend)
- 보안 검토: **필요** (PRD 보안 민감도 4개 체크 — 인증/세션, 권한/RBAC, 시크릿, 외부 입력 → DB)
- 접근성 검토: **필요** (frontend 범위 — execute 단계에서 호출)

## 마지막 작업 요약

**백엔드 라운드 1 완료** (2026-05-01). 선결(env+ValidationPipe 회귀 검증) → tour 모듈(HttpModule+ACL+컨트롤러+에러 마스킹) → wishlist 모듈(엔티티+migration+IDOR 차단 service+컨트롤러+CurrentUser 데코레이터) 모두 TDD로 작성. 기존 19개 + 새 16개 = **테스트 35/35 통과**, 빌드 통과. node-specialist 위임 → 누락분(wishlist 빌더/컨트롤러/모듈, 데코레이터, migration)은 main에서 보강. rxjs 중복 설치로 발생한 `Observable` 타입 충돌은 `npm dedupe`로 해소.

## 다음 액션

프론트 라운드 진입. `/execute` 재진입 시 아래 4번부터:

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
- `docs/plans/0002-tour-wishlist/questions.md` — 세션 중 사용자 개념 질문 누적 로그 (생성)
- `.env`, `.env.example` — `TOUR_API_KEY` 환경변수 추가 (Decoding 키)
- `backend/package.json` — `@nestjs/axios` ^4 + `axios` ^1 추가
- `backend/src/config/env.validation.ts` — `TOUR_API_KEY: Joi.string().required()` 검증 추가
- `backend/src/auth/decorators/current-user.decorator.ts` — `req.user.sub` 추출 파라미터 데코레이터 (IDOR 차단 핵심)
- `backend/src/tour/tour.module.ts` — `HttpModule.registerAsync` + 공통 params(serviceKey/MobileOS/_type) 자동 주입, AuthModule import
- `backend/src/tour/tour.service.ts` — searchByKeyword/fetchCommon/fetchIntro + ACL 매퍼 + serializeAxiosError(serviceKey 마스킹)
- `backend/src/tour/tour.service.spec.ts` — ACL 매핑/hasMore 경계/null 정규화/503 변환/시리얼라이저 누설 7케이스
- `backend/src/tour/tour.controller.ts` — `@UseGuards(JwtAuthGuard)` + 3개 GET 엔드포인트
- `backend/src/tour/dto/{tour-item,tour-detail,tour-search-response,tour-search-query,tour-content-id-param}.dto.ts` — DTO + class-validator
- `backend/src/wishlist/wishlist.module.ts` — `TypeOrmModule.forFeature([Wishlist])` + AuthModule import
- `backend/src/wishlist/wishlist.service.ts` — `userId` 첫 인자 강제 + `repo.delete({id,userId})` IDOR 차단 + 23505 → 409
- `backend/src/wishlist/wishlist.service.spec.ts` — list/add/remove + IDOR 회귀 6케이스
- `backend/src/wishlist/wishlist.controller.ts` — `@CurrentUser()` + `ParseUUIDPipe` + 204 응답
- `backend/src/wishlist/dto/{create-wishlist,wishlist-item}.dto.ts` — 입력/응답 DTO
- `backend/src/wishlist/entities/wishlist.entity.ts` — 컬럼 평탄화 스냅샷 (snapshotTitle/FirstImage/Addr)
- `backend/src/migrations/1714099300000-init-wishlist.ts` — wishlist 테이블 + (userId,contentId) UNIQUE + (userId,createdAt) 인덱스
- `backend/src/app.module.ts` — TourModule + WishlistModule imports에 추가

## 미해결 결정 / 질문

- 없음. 백엔드 라운드는 ADR 그대로 구현. 프론트 라운드 진입 시 BE↔FE envelope `{items,page,hasMore}` 정확 미러링이 핵심 회귀 지점.
- migration은 아직 DB에 적용 안 함(`npm --workspace backend run migration:run`은 프론트 라운드 종료 후 통합 검증 시점에 실행).
