# Vercel React Best Practices 리팩토링 플랜

- **날짜**: 2026-04-03
- **작업 목표**: Vercel React Best Practices 스킬(69개 룰, 8개 카테고리) 기준으로 프로젝트를 분석하고, 적용 가능한 개선점을 리팩토링한 뒤 before/after 리포트 작성

---

## Context

Vercel React Best Practices 스킬을 기준으로 현재 프로젝트를 분석한 결과, 5개의 적용 가능한 개선점을 발견했다. React Compiler가 이미 활성화되어 있어 memo/useMemo/useCallback 관련 룰은 대부분 자동 처리되므로 제외하고, 실질적으로 의미 있는 변경만 진행한다.

## 리팩토링 항목

### 1. 중복 디렉토리 읽기 제거 (server-parallel-fetching)
- **파일**: `app/blog/page.tsx`, `app/page.tsx`, `features/blog/lib/posts.ts`
- **문제**: `getPostList()` + `getTagList()` 호출 시 같은 디렉토리를 2번 읽음 (`getTagListFrom`이 내부적으로 `getPostListFrom`을 다시 호출)
- **해결**: 이미 로드한 posts에서 태그를 직접 추출. 사용되지 않는 `getTagList`, `getStoryTagList`, `getTagListFrom` 제거

### 2. React.cache()로 slug 조회 중복 제거 (server-cache-react)
- **파일**: `features/blog/lib/posts.ts`, `app/blog/[slug]/page.tsx`, `app/stories/[slug]/page.tsx`
- **문제**: `generateMetadata()`와 페이지 컴포넌트가 각각 `getPostBySlug(slug)`를 호출하여 같은 파일을 2번 읽음
- **해결**: `React.cache()`로 래핑하여 같은 요청 내 중복 제거
- **참고**: 현재 SSG라 빌드 타임에만 영향. 향후 ISR/동적 렌더링 전환 시 실질적 효과

### 3. mdxComponents 객체 모듈 레벨로 호이스트 (rendering-hoist-jsx)
- **파일**: `app/stories/[slug]/page.tsx`
- **문제**: `components={{ Tooltip, Mention }}` 인라인 객체 생성. `blog/[slug]/page.tsx`는 이미 모듈 레벨로 호이스트되어 있어 불일치
- **해결**: `const mdxComponents = { Tooltip, Mention };` 모듈 레벨로 통일

### 4. 배열 순회 통합 + 불변 정렬 (js-combine-iterations + js-tosorted-immutable)
- **파일**: `features/search/components/SearchContent.tsx`
- **문제**: `filterAndSort()`가 `.map().filter().sort().map()` = 4회 순회. `.sort()`는 뮤테이션
- **해결**: `flatMap`으로 map+filter 통합 (3회로 감소), `toSorted`로 불변성 확보

### 5. 검색 입력 반응성 개선 (rerender-use-deferred-value)
- **파일**: `features/search/components/SearchContent.tsx`
- **문제**: 매 키 입력마다 `filterAndSort` 동기 실행으로 입력 차단 가능
- **해결**: `useDeferredValue`로 필터링을 낮은 우선순위로 지연, 입력 반응성 유지
- **참고**: React Compiler가 자동 메모이제이션하므로 `useMemo` 불필요

## 구현 순서

1. `posts.ts` 수정 (항목 1 + 2 동시)
2. `app/blog/page.tsx`, `app/page.tsx` 수정 (항목 1 호출부)
3. `app/stories/[slug]/page.tsx` 수정 (항목 3)
4. `SearchContent.tsx` 수정 (항목 4 + 5 동시)
5. `reports/` 폴더에 before/after 비교 리포트 작성

## 리포트 구조

`reports/vercel-react-best-practices-refactoring.md`에 변경 종류별로:
- 룰 이름과 설명
- Before 코드 (바뀐 부분만)
- After 코드 (바뀐 부분만)
- 바뀜으로서 얻는 효용을 리액트 개발자가 이해할 수 있도록 정리

## 검증

- `npm run lint` + `npm run format:check`
- `npm run build` (컴포넌트/import 변경 포함이므로 필수)
