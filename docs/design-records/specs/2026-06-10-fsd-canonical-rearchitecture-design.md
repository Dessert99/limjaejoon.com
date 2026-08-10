# 프론트엔드 캐노니컬 FSD 재아키텍처 (Tier 3)

작성일: 2026-06-10

## 목표

프론트엔드를 공식(Feature-Sliced Design) 표준에 완전히 맞춘다. 현재도 레이어·segment 명명은 FSD를 따르나, 다음이 빠져 있다: `pages`/`widgets`/`entities` 레이어, Public API(`index.ts`) 강제, 슬라이스 의미론(예: `about`이 feature로 오분류), 자동 강제 도구.

성공 기준(검증 게이트): `npx steiger src` 위반 0 + `npm run lint` + `npm run build:fe` + `npm run test -w frontend` 전부 통과.

## 비목표

- 런타임 동작·UI 변경 없음. 순수 구조 이전.
- 백엔드 변경 없음.
- `shared/styles`의 vanilla-extract `.css.ts`는 Public API 예외(아래 §4).

## 1. 디렉터리 골격 (공식 Next.js 가이드)

공식 가이드: Next `app/`는 루트 유지, 모든 FSD 레이어는 `src/`, FSD `pages`는 `src/pages`, 루트에 빈 `pages/`로 Next pages-router 충돌 방지, 라우트는 `@/pages/*` re-export.

```
frontend/
├── app/                  # Next 라우터 — 얇은 re-export, 라우트 전용 파일(layout/robots/sitemap)
├── pages/                # 빈 폴더(.gitkeep) — Next pages-router 충돌 방지
└── src/                  # 모든 FSD 레이어
    ├── pages/            # home · blog · blog-post · not-found
    ├── widgets/          # site-header · blog-list
    ├── features/         # post-search · tag-filter · theme-switcher
    ├── entities/         # post · profile
    └── shared/           # ui · styles · config · api · lib
```

alias: `@/* → ./src/*` (tsconfig). vitest는 tsconfigPaths로 자동 추종.

## 2. 슬라이스 분해 맵 (현재 → 목표)

### entities/
- `blog/model/types.ts`, `blog/model/tags.ts` → `entities/post/model/`
- `blog/lib/posts.ts` → `entities/post/api/posts.ts`
- `blog/lib/extract-headings.ts`, `blog/lib/mdx-options.ts` → `entities/post/lib/`
- `blog/ui/BlogCard/` → `entities/post/ui/BlogCard/`
- `about/model/{profile,experience,education,projects,skills,activities,types}.ts` → `entities/profile/model/`

### features/
- `blog/ui/SearchBox/` + `blog/lib/filter-posts.ts` → `features/post-search/` (ui + lib)
- `blog/ui/TagSidebar/` → `features/tag-filter/ui/`
- `navigation/ui/ThemeMenu/` + `navigation/lib/useSeason.ts` → `features/theme-switcher/` (ui + model/useSeason)

### widgets/
- `navigation/ui/SiteHeader/` + `navigation/config/navItems.ts` + `navigation/model/types.ts` → `widgets/site-header/`
- `blog/ui/BlogList/` → `widgets/blog-list/ui/`

### pages/ (신설 — 조립 담당)
- `pages/home` ← about 섹션 + entities/profile + 홈 라우트 css
- `pages/blog` ← widgets/blog-list + features/post-search + features/tag-filter + entities/post(getPostList)
- `pages/blog-post` ← MDX 렌더 + TableOfContents + entities/post(getPostBySlug) + generateMetadata/generateStaticParams
- `pages/not-found` ← not-found 본문

### shared/ (도메인 무관 프리미티브로 끌어내림)
- `about/ui/SectionReveal/`, `about/ui/IconTile/`, `about/ui/Timeline/` → `shared/ui/` (제네릭; `TimelineItem` 타입은 entities/profile)
- 유지: `shared/ui/{Chip,Icon}`, `shared/styles/*`, `shared/config/site.ts`, `shared/api/mocks/*`

### app/ (얇게)
- `(public)/page.tsx` → `export { HomePage as default } from '@/pages/home'`
- `(public)/blog/page.tsx` → `@/pages/blog` re-export
- `(public)/blog/[slug]/page.tsx` → `@/pages/blog-post` re-export (default + generateMetadata + generateStaticParams)
- `(public)/not-found.tsx` → `@/pages/not-found` re-export
- 라우트별 `*.css.ts` → 해당 `pages/*/ui/`로 이동
- `app/layout.tsx`, `(public)/layout.tsx`, `robots.ts`, `sitemap.ts` → app 유지, public API 경유 import

## 3. 확정된 판단 (설계 §3)

1. about 섹션 → **`pages/home/ui`** (홈 전용·비재사용 → page-local). widgets 아님.
2. 사이트 소유자 데이터 → **`entities/profile`**.
3. `Timeline`/`IconTile`/`SectionReveal` → **`shared/ui`** (제네릭).
4. `tag-filter`를 `post-search`와 **분리된 feature**로.
5. `mdx-options` → **`entities/post/lib`**.

## 4. Public API · import 규칙

- 모든 슬라이스(및 shared의 각 segment)에 `index.ts` Public API.
- 슬라이스 외부 → `@/` alias + Public API만. 슬라이스 내부 → 상대경로.
- 예외: `shared/styles/*.css.ts`는 deep import 유지(vanilla-extract 번들 부작용 회피). 이유를 folder-structure.md에 명문화.

## 5. 도구 · 설정

- **Steiger** 도입(devDependency). `steiger.config.*`로 `src` 검사. 마이그레이션 중 위반 전수 검출 + CI 강제.
- tsconfig `paths`: `@/* → ./src/*`.
- 빈 루트 `pages/.gitkeep`.
- eslint: 함수-스타일 규칙 glob을 `src/**`로 갱신.
- 루트/`frontend` package.json `ci` 스크립트에 steiger 추가 검토.

## 6. 빌드 리스크 + 폴백

Next가 `src/pages`를 레거시 Pages Router로 오인할 수 있음. 공식 우회(빈 루트 `pages/`)를 적용하고 **`npm run build:fe` 통과 + `src/pages`가 라우터로 안 잡힘**을 게이트로 둔다. 실패 시 폴백: FSD pages 레이어를 `views/`로 리네임(다수 FSD+Next 팀 방식).

## 7. 문서 갱신

- `folder-structure.md`: pages/widgets/entities 레이어 추가, Public API 필수화, styles 예외 명문화.
- `architecture-convention.md`: lib/model 정의를 바닐라 FSD에 맞춤(lib에 훅 허용).
- `api-convention.md`: api = 데이터 소스 경계(HTTP + 빌드타임 콘텐츠).
- `CLAUDE.md`: 구조 설명 한 줄 갱신.

## 8. 단계별 실행 계획 (각 단계 = 검증 게이트 통과 후 커밋)

리스크를 "이전"과 "재분류"로 분리한다.

- **P0 베이스라인**: 테스트/빌드/린트 green 확인(테스트 인프라 커밋 직후).
- **P1 src/ 이전**: 기존 `features`/`shared`를 그대로 `src/`로 `git mv`. tsconfig alias·eslint glob 갱신. 빈 루트 `pages/` 추가. FSD 재분류 없음(순수 이동). → 게이트: build+test+lint. 커밋.
- **P2 entities/features/widgets 재분류**: 도메인별로 이동(post → profile → navigation 분해), Public API `index.ts` 추가, 내부 import 상대경로화. → 각 도메인마다 게이트. 도메인별 커밋.
- **P3 pages 레이어 + app 얇게**: 조립·라우트 css를 `src/pages/*`로, app 라우트를 re-export로. → 게이트(빌드 리스크 §6 집중 검증). 커밋.
- **P4 Steiger**: 설정 추가, `npx steiger src` 위반 0까지 수정. → 커밋.
- **P5 문서**: §7 갱신. → 커밋.

## 9. 실행 메모

- ~70+ 파일 ops. 이동은 `git mv`로 히스토리 보존.
- 이 레포 정책상 Claude는 현재 브랜치(main)에서 커밋만. push·브랜치·머지는 사용자가 터미널에서.
