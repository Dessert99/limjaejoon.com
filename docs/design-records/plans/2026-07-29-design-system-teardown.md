# 디자인 시스템 철거 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tailwind 전환에 앞서 vanilla-extract 기반 디자인 시스템과 그 위에 세워진 화면 전부를 제거하고, API·인증·도메인 계층만 남은 상태로 만든다.

**Architecture:** "뷰는 전부 지우고 데이터·전송은 전부 남긴다"는 경계 하나로 모든 삭제 판단이 결정된다. FSD 의존 방향의 상위(라우트·화면)부터 하위(shared)로 내려가며 5단계로 커밋해, 각 단계에서 무엇이 깨졌는지 명확히 드러나게 한다.

**Tech Stack:** Next.js 16 App Router, TypeScript, Vitest + Testing Library, Steiger(FSD), ESLint

설계 근거는 [2026-07-29-design-system-teardown-design.md](../specs/2026-07-29-design-system-teardown-design.md) 참고.

## Global Constraints

- Tailwind CSS 를 설치하지 않는다. 이번 작업은 삭제까지다.
- `postcss.config.mjs` 는 건드리지 않는다. `plugins: {}` 빈 상태 그대로 Tailwind 자리로 남긴다.
- `app/api/**`, `entities/session`, `entities/user`, `entities/post/api`·`model`, `features/auth` 의 `api`·`model`, `tests/integration/` 은 손대지 않는다.
- `entities/profile` 은 소비자가 0이 되어도 남긴다.
- 새로 쓰는 테스트의 `describe`·`it` 설명문은 한국어로 쓴다.
- 새로 쓰는 코드의 파일 헤더와 모든 export 에 단일 라인 JSDoc(`/** ... */`)을 단다. 멀티라인 블록 금지.
- ESLint `arrow-body-style: ['error', 'always']` 가 걸려 있다. 화살표 함수는 항상 블록 바디로 쓴다.
- 1~3 단계 중간에는 `type-check`·`build` 가 깨질 수 있다. 정상이다. 4단계 완료 시점부터 전체 검증을 통과해야 한다.

---

### Task 1: 라우트·화면 제거

**Files:**

- Delete: `app/(public)/` 전체 6파일
- Delete: `app/admin/` 전체 5파일
- Delete: `src/pages/blog/`, `src/pages/blog-post/`, `src/pages/lab/`, `src/pages/lab-animation/`, `src/pages/lab-transition/`, `src/pages/admin-posts/`, `src/pages/admin-login/`
- Delete: `src/pages/home/ui/IntroSection/`, `src/pages/home/ui/RiverSection/`, `src/pages/home/ui/SceneSection/`
- Modify: `src/pages/home/ui/HomePage.tsx`
- Test: `src/pages/home/ui/HomePage.test.tsx` (재작성)
- Modify: `app/sitemap.ts`
- Test: `app/sitemap.test.ts` (재작성)

**Interfaces:**

- Consumes: 없음 (첫 태스크)
- Produces: `HomePage()` — 인자 없음, `<main />` 만 반환. `app/page.tsx` 가 `@/pages/home` 에서 default 로 re-export 하는 계약은 그대로 유지된다.

- [ ] **Step 1: HomePage 테스트를 빈 껍데기 계약으로 재작성**

`src/pages/home/ui/HomePage.test.tsx` 전체를 교체:

```tsx
/** HomePage 테스트 — 빈 껍데기 계약만 검증한다 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('main 엘리먼트 하나만 렌더한다', () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll('main')).toHaveLength(1);
  });

  it('철거한 섹션을 더 이상 렌더하지 않는다', () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll('section')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npx vitest run src/pages/home/ui/HomePage.test.tsx` Expected: FAIL — 현재 `HomePage` 는 `<section>` 2개를 렌더하므로 두 번째 케이스가 깨진다.

- [ ] **Step 3: HomePage 를 빈 껍데기로 축소**

`src/pages/home/ui/HomePage.tsx` 전체를 교체:

```tsx
/** 포트폴리오 홈 — 새 디자인 시스템을 올릴 빈 껍데기 */

/** 홈 페이지 구성 */
export function HomePage() {
  return <main />;
}
```

- [ ] **Step 4: 테스트가 통과하는지 확인**

Run: `npx vitest run src/pages/home/ui/HomePage.test.tsx` Expected: PASS (2 tests)

- [ ] **Step 5: sitemap 테스트를 축소된 계약으로 재작성**

`app/sitemap.test.ts` 전체를 교체:

```ts
/** sitemap 테스트 — 존재하는 route 만 노출하는지 검증한다 */
import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('루트 URL 하나만 노출한다', () => {
    expect(sitemap()).toEqual([
      expect.objectContaining({ url: 'https://limjaejoon.com' }),
    ]);
  });

  it('철거한 blog route 를 노출하지 않는다', () => {
    const urls = sitemap().map((entry) => {
      return entry.url;
    });
    const hasBlogUrl = urls.some((url) => {
      return url.includes('/blog');
    });

    expect(hasBlogUrl).toBe(false);
  });
});
```

- [ ] **Step 6: 테스트가 실패하는지 확인**

Run: `npx vitest run app/sitemap.test.ts` Expected: FAIL — 현재 `sitemap` 은 async 라 `sitemap()` 이 Promise 를 반환하고, `/blog` 항목도 들어 있다.

- [ ] **Step 7: sitemap 을 루트 URL 하나로 축소**

`app/sitemap.ts` 전체를 교체:

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/config';

/** 존재하는 public route 만 sitemap 에 노출한다 */
export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split('T')[0];

  return [
    {
      url: SITE_URL,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
```

DB 를 읽지 않으므로 `async` 와 `createSupabaseStaticClient`·`getPublishedPostNavigationData` import 가 함께 사라진다.

- [ ] **Step 8: 테스트가 통과하는지 확인**

Run: `npx vitest run app/sitemap.test.ts` Expected: PASS (2 tests)

- [ ] **Step 9: 라우트 디렉터리 삭제**

```bash
git rm -r "app/(public)" app/admin
```

`app/api/admin/` 은 경로가 달라 영향받지 않는다. 삭제 후 `ls app/api/admin` 으로 남아 있는지 확인한다.

- [ ] **Step 10: pages 슬라이스 삭제**

```bash
git rm -r src/pages/blog src/pages/blog-post src/pages/lab src/pages/lab-animation src/pages/lab-transition src/pages/admin-posts src/pages/admin-login
git rm -r src/pages/home/ui/IntroSection src/pages/home/ui/RiverSection src/pages/home/ui/SceneSection
```

- [ ] **Step 11: 이 단계에서 남은 테스트가 통과하는지 확인**

Run: `npx vitest run app src/pages` Expected: PASS — `app/api/**` 라우트 테스트, `app/sitemap.test.ts`, `HomePage.test.tsx` 만 남아 전부 통과.

- [ ] **Step 12: 커밋**

```bash
git add -A app src/pages
git commit -m "$(cat <<'EOF'
refactor: remove routes and page slices for design system teardown

blog·lab·admin 화면과 홈 섹션을 걷어냈다. HomePage 는 빈 껍데기로 남기고
sitemap 은 삭제된 blog route 를 더는 광고하지 않도록 루트 URL 하나로 줄였다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: widgets·features 제거

**Files:**

- Delete: `src/widgets/scene-backdrop/`, `src/widgets/site-header/`
- Delete: `src/features/theme-toggle/`, `src/features/post-editor/`, `src/features/post-filter/`
- Delete: `src/features/auth/ui/`
- Modify: `src/features/auth/index.ts`

**Interfaces:**

- Consumes: Task 1 에서 이 슬라이스들의 소비자(화면)가 모두 사라진 상태
- Produces: `@/features/auth` 의 public API 가 `signIn`, `signOut` 두 함수만 노출한다. `useSignIn` 은 `model/` 에 남지만 배럴에 없던 상태 그대로 둔다.

- [ ] **Step 1: widgets 두 슬라이스 삭제**

```bash
git rm -r src/widgets/scene-backdrop src/widgets/site-header
```

`src/widgets/` 가 빈 디렉터리가 된다. git 은 빈 디렉터리를 추적하지 않으므로 그대로 둔다.

- [ ] **Step 2: features 세 슬라이스 삭제**

```bash
git rm -r src/features/theme-toggle src/features/post-editor src/features/post-filter
```

- [ ] **Step 3: auth 의 UI 만 삭제**

```bash
git rm -r src/features/auth/ui
```

`src/features/auth/api/`, `src/features/auth/model/` 은 남긴다.

- [ ] **Step 4: auth 배럴에서 사라진 export 제거**

`src/features/auth/index.ts` 전체를 교체:

```ts
/** auth feature public API */
export { signIn } from './api/signIn';
export { signOut } from './api/signOut';
```

- [ ] **Step 5: 남은 auth 테스트가 통과하는지 확인**

Run: `npx vitest run src/features` Expected: PASS — `signIn.test.ts`, `signOut.test.ts` 만 남아 통과.

- [ ] **Step 6: 커밋**

```bash
git add -A src/widgets src/features
git commit -m "$(cat <<'EOF'
refactor: remove widgets and view-layer features

scene-backdrop·site-header 위젯과 theme-toggle·post-editor·post-filter 를 걷어냈다.
auth 는 UI 만 지우고 signIn·signOut 전송 계층은 남겼다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: shared 디자인 계층 제거

**Files:**

- Delete: `src/shared/ui/` 전체
- Delete: `src/shared/styles/` 전체
- Delete: `src/shared/lib/gsap/`
- Delete: `src/entities/post/ui/`, `src/entities/post/client.ts`
- Modify: `src/entities/post/index.ts`
- Modify: `app/layout.tsx`

**Interfaces:**

- Consumes: Task 1·2 에서 `@/shared/ui`·`@/shared/styles` 소비자가 전부 사라진 상태
- Produces: `@/entities/post` 가 API 함수 8종과 타입 6종만 노출한다 — 함수는 `createAdminPost`, `updateAdminPost`, `fetchPublishedPostFromApi`, `fetchPublishedPostsFromApi`, `getPublishedPostBySlug`, `getPublishedPostNavigationData`, `getPublishedPosts`, `getPublishedPostSlugs`. 타입은 `UpsertPostInput`, `Post`, `PostListItem`, `PostSearchParams`, `PostSeries`, `PostStatus`.

- [ ] **Step 1: 삭제 전 소비자가 정말 0인지 확인**

```bash
grep -rn "@/shared/ui\|@/shared/styles\|shared/lib/gsap\|entities/post/client\|PostMarkdown" src app
```

Expected: 결과 없음. 결과가 나오면 그 파일이 Task 1·2 에서 누락된 것이므로 먼저 처리한다.

- [ ] **Step 2: shared 디자인 계층 삭제**

```bash
git rm -r src/shared/ui src/shared/styles src/shared/lib/gsap
```

`src/shared/lib/navigation.ts` 와 `src/shared/lib/index.ts` 는 남는다. `index.ts` 는 `navigation` 만 export 하고 있어 수정이 필요 없다.

- [ ] **Step 3: post entity 의 뷰 계층 삭제**

```bash
git rm -r src/entities/post/ui src/entities/post/client.ts
```

- [ ] **Step 4: post 배럴에서 PostMarkdown 제거**

`src/entities/post/index.ts` 에서 아래 두 줄을 지운다:

```ts
export { PostMarkdown } from './ui/PostMarkdown/PostMarkdown';
export type { PostMarkdownProps } from './ui/PostMarkdown/PostMarkdown';
```

나머지 export 는 그대로 둔다.

- [ ] **Step 5: 루트 레이아웃에서 테마 부트스크립트와 전역 스타일 제거**

`app/layout.tsx` 에서:

- 1행 `import { themeBootScript } from '@/features/theme-toggle';` 삭제
- 3행 `import '@/shared/styles/global.css';` 삭제
- `<html>` 의 `suppressHydrationWarning` 과 바로 위 주석 삭제
- `<body>` 안의 `<script dangerouslySetInnerHTML={...} />` 와 그 주석 삭제

결과는 다음과 같다:

```tsx
import { SITE_URL } from '@/shared/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'limjaejoon.com',
    template: '%s | 임재준',
  },
  description: 'limjaejoon.com shell',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: '임재준',
    title: 'limjaejoon.com',
    description: 'limjaejoon.com shell',
  },
  twitter: {
    card: 'summary',
    title: 'limjaejoon.com',
    description: 'limjaejoon.com shell',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='ko'
      data-scroll-behavior='smooth'>
      <body>{children}</body>
    </html>
  );
}
```

`data-scroll-behavior` 는 Next 의 스크롤 경고 억제 속성이라 테마와 무관하다. 남긴다.

- [ ] **Step 6: 남은 .css.ts 가 0개인지 확인**

```bash
find src app -name "*.css.ts"
```

Expected: 결과 없음.

- [ ] **Step 7: 커밋**

```bash
git add -A src app/layout.tsx
git commit -m "$(cat <<'EOF'
refactor: remove shared design layer

shared/ui 프리미티브 14종과 vanilla-extract 토큰·테마 전체, GSAP 래퍼,
PostMarkdown 을 걷어냈다. 루트 레이아웃에서 테마 부트스크립트와 전역 스타일을 뺐다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: 빌드 배선·패키지 정리

**Files:**

- Modify: `next.config.ts`
- Modify: `vitest.config.ts`
- Modify: `vitest.setup.ts`
- Modify: `eslint.config.mjs`
- Modify: `steiger.config.ts`
- Modify: `package.json`
- Modify: `package-lock.json` (재생성)
- Delete: `eslint-rules/`, `.storybook/`, `storybook-static/`

**Interfaces:**

- Consumes: Task 3 이후 `.css.ts` 가 0개인 상태
- Produces: 전체 검증 명령이 통과하는 저장소. 이 태스크 완료 시점부터 스펙 1절의 성공 기준을 전부 만족해야 한다.

- [ ] **Step 1: next.config.ts 에서 vanilla-extract 래핑 제거**

전체를 교체:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

- [ ] **Step 2: vitest.config.ts 에서 vanillaExtractPlugin 제거**

전체를 교체:

```ts
import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// tsconfigPaths: @/* alias 네이티브 해석 / react: JSX 변환
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'tests/integration/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

- [ ] **Step 3: vitest.setup.ts 에서 Radix·GSAP 셔임 제거**

전체를 교체:

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/shared/api/mocks/server';

// MSW 목 서버: 테스트 전체에서 켜고, 핸들링 안 된 요청은 에러로 드러낸다.
beforeAll(() => {
  return server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  return server.resetHandlers();
});
afterAll(() => {
  return server.close();
});

// globals:false 라 RTL 자동 cleanup 이 안 걸린다 — 각 테스트 후 수동 언마운트.
afterEach(() => {
  cleanup();
});
```

포인터 캡처 셔임은 Radix Select 전용, `matchMedia` 셔임은 GSAP ScrollTrigger 전용이라 둘 다 소비자가 사라졌다.

- [ ] **Step 4: 테스트를 돌려 셔임 제거가 안전한지 확인**

Run: `npm run test` Expected: PASS. 실패한다면 어떤 테스트가 `matchMedia` 를 필요로 하는지 보고 그 셔임만 되살린다.

- [ ] **Step 5: eslint.config.mjs 에서 디자인 토큰 블록 제거**

세 군데를 지운다:

- 상단 `import designTokens from './eslint-rules/index.mjs';` 와 그 위 주석
- `**/*.css.ts` 를 대상으로 하는 `design-tokens` 플러그인 블록 전체와 그 위 주석
- `globalIgnores` 안의 `'storybook-static/**'` 항목과 그 위 주석 (Storybook 을 제거하므로 죽은 항목)

- [ ] **Step 6: steiger.config.ts 정리**

`./src/shared/styles/**` 를 대상으로 하는 블록 전체를 지운다. 그리고 `fsd/no-public-api-sidestep` 을 켜본다 — 이 룰을 껐던 유일한 이유가 `shared/styles` deep import 였다. 결과는 다음과 같다:

```ts
import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  // 테스트·MSW 목은 구조(FSD) 규칙 대상이 아니다.
  { ignores: ['**/*.test.*', '**/mocks/**'] },

  ...fsd.configs.recommended,

  {
    rules: {
      // 자문 규칙 — 끈다. FSD app 레이어가 Next 루트 app/(steiger 의 src 스캔 밖)에 있어
      // app→pages 참조가 집계되지 않아 슬라이스가 "참조 없음"으로 오탐된다.
      'fsd/insignificant-slice': 'off',
    },
  },
]);
```

- [ ] **Step 7: Steiger 를 돌려 룰 재활성화가 통과하는지 확인**

Run: `npm run fsd` Expected: PASS. 실패하면 `'fsd/no-public-api-sidestep': 'off'` 를 rules 블록에 되살리고, 주석에 실제 사유를 한 줄로 적는다.

- [ ] **Step 8: 빌드 도구 디렉터리 삭제**

`storybook-static/` 은 빌드 산출물이라 추적 여부를 먼저 확인한다:

```bash
git ls-files storybook-static | head -1
```

결과가 있으면(추적 중) `git rm -r` 로, 없으면(gitignore 됨) `rm -rf` 로 지운다:

```bash
git rm -r eslint-rules .storybook
```

- [ ] **Step 9: package.json 에서 스크립트와 패키지 제거**

`scripts` 에서 `storybook`, `build-storybook` 두 줄을 지운다.

`dependencies` 에서 17개를 지운다: `@codemirror/lang-markdown`, `@gsap/react`, `@uiw/react-codemirror`, `@vanilla-extract/css`, `@vanilla-extract/next-plugin`, `@vanilla-extract/sprinkles`, `github-slugger`, `gsap`, `next-mdx-remote`, `radix-ui`, `react-icons`, `react-markdown`, `rehype-autolink-headings`, `rehype-pretty-code`, `rehype-slug`, `remark-gfm`, `shiki`

`devDependencies` 에서 6개를 지운다: `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/nextjs-vite`, `@vanilla-extract/recipes`, `@vanilla-extract/vite-plugin`, `storybook`

`@vitejs/plugin-react`, `babel-plugin-react-compiler`, `msw`, `steiger`, `@feature-sliced/steiger-plugin` 은 남긴다.

- [ ] **Step 10: lockfile 재생성**

```bash
npm install
```

`package-lock.json` 이 갱신된다. `node_modules` 에서 제거 패키지가 빠지므로 이후 검증이 실제 상태를 반영한다.

- [ ] **Step 11: 잔재 확인**

```bash
grep -rn "vanilla-extract" src app *.ts *.mjs package.json
npm ls --depth=0
```

Expected: 첫 명령은 결과 없음. 두 번째는 제거 패키지가 목록에 없고 에러도 없음.

- [ ] **Step 12: 전체 검증**

```bash
npm run fsd && npm run lint && npm run type-check && npm run test && npm run build
```

Expected: 전부 통과. 하나라도 실패하면 그 원인을 고친 뒤 다시 돌린다.

- [ ] **Step 13: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
build: drop vanilla-extract, Storybook, and design token lint wiring

next·vitest·eslint·steiger 설정에서 디자인 시스템 배선을 걷어내고
고아가 된 패키지 23종과 lockfile 을 정리했다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: 문서 정리

**Files:**

- Delete: `docs/conventions/design-system-component.md`, `docs/conventions/component-convention.md`
- Delete: `docs/learning/radix-primitives.md`
- Delete: `docs/superpowers/specs/` 10개, `docs/superpowers/plans/` 14개
- Modify: `CLAUDE.md`

**Interfaces:**

- Consumes: Task 4 완료 후 코드가 검증을 통과하는 상태
- Produces: 없음 (마지막 태스크)

- [ ] **Step 1: 컨벤션·학습 문서 삭제**

```bash
git rm docs/conventions/design-system-component.md docs/conventions/component-convention.md docs/learning/radix-primitives.md
```

`architecture-convention.md`, `folder-structure.md`, `form-convention.md`, `nextjs-conventions.md`, `tdd-convention.md`, `comment-convention.md` 은 남긴다.

- [ ] **Step 2: 디자인 시스템 계열 spec 삭제**

`cd` 는 이후 명령의 작업 디렉터리를 바꿔버리므로 저장소 루트에서 전체 경로로 지운다:

```bash
git rm docs/superpowers/specs/2026-06-15-button-component-design.md docs/superpowers/specs/2026-06-15-color-token-themes-design.md docs/superpowers/specs/2026-06-16-radix-primitives-design.md docs/superpowers/specs/2026-07-06-lab-animation-design.md docs/superpowers/specs/2026-07-06-lab-transition-design.md docs/superpowers/specs/2026-07-07-design-token-foundation-design.md docs/superpowers/specs/2026-07-24-home-portfolio-remake-design.md docs/superpowers/specs/2026-07-25-design-system-terracotta-retheme-design.md docs/superpowers/specs/2026-07-25-strict-design-token-lint-design.md docs/superpowers/specs/2026-07-26-home-intro-section-design.md
```

남기는 spec: `2026-06-10-fsd-canonical-rearchitecture-design.md`, `2026-06-13-comment-convention-design.md`, `2026-07-09-blog-platform-phase-1-design.md`, `2026-07-23-admin-auth-design.md`, `2026-07-29-design-system-teardown-design.md`

- [ ] **Step 3: 디자인 시스템 계열 plan 삭제**

```bash
git rm docs/superpowers/plans/2026-06-15-button-component.md docs/superpowers/plans/2026-06-15-color-token-themes.md docs/superpowers/plans/2026-06-16-radix-primitives-wave-0.md docs/superpowers/plans/2026-06-16-radix-primitives-wave-1.md docs/superpowers/plans/2026-07-06-lab-animation.md docs/superpowers/plans/2026-07-06-lab-transition.md docs/superpowers/plans/2026-07-07-design-token-foundation.md docs/superpowers/plans/2026-07-08-button-action-component.md docs/superpowers/plans/2026-07-24-home-portfolio-remake.md docs/superpowers/plans/2026-07-25-motion-material-button.md docs/superpowers/plans/2026-07-25-primitives-restyle.md docs/superpowers/plans/2026-07-25-strict-design-token-lint.md docs/superpowers/plans/2026-07-25-terracotta-color-tokens.md docs/superpowers/plans/2026-07-26-home-intro-section.md
```

남기는 plan: `2026-06-13-comment-convention.md`, `2026-07-09-blog-platform-phase-1.md`, `2026-07-24-admin-auth.md`, `2026-07-29-design-system-teardown.md`

- [ ] **Step 4: CLAUDE.md 의 죽은 포인터 제거**

`## 구조` 절 첫 문단 끝의 다음 문장을 지운다:

```
컴포넌트 구현 기본값은 [component-convention.md](docs/conventions/component-convention.md) 참고.
```

앞 문장(`구조는 Steiger(npm run fsd)로 강제한다.`)까지는 그대로 둔다.

- [ ] **Step 5: 죽은 링크가 남지 않았는지 확인**

```bash
grep -rn "component-convention\|design-system-component\|radix-primitives" CLAUDE.md AGENTS.md docs/
```

Expected: 결과 없음. 남은 문서가 삭제된 문서를 참조하면 그 참조도 지운다.

- [ ] **Step 6: 최종 전체 검증**

```bash
npm run fsd && npm run lint && npm run type-check && npm run test && npm run build
```

Expected: 전부 통과.

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "$(cat <<'EOF'
docs: remove design system documentation

철거한 프리미티브·토큰·lab·홈 관련 컨벤션 문서와 spec·plan 24건을 정리하고
CLAUDE.md 의 죽은 포인터를 뺐다.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 8: dev 서버로 최종 확인**

dev 서버를 띄워 `/` 가 빈 페이지로 뜨고 콘솔 에러가 없는지 확인한다. 전역 스타일이 없으므로 브라우저 기본 스타일 상태가 정상이다.
