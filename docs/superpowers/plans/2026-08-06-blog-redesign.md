# 블로그 개편 구현 계획

**Goal:** `posts` 서버 계층 위에 공개 읽기 화면과 어드민 쓰기 화면을 세워, 글을 쓰고 발행하면 재배포 없이 `/blog` 에 드러나게 한다.

**Architecture:** 공개 화면은 빌드 시점에 Supabase 를 직접 읽어 정적 HTML 로 굳고, 어드민 쓰기가 `revalidatePath` 로 그 정적 결과만 다시 굽는다. Markdown 렌더 규칙은 `markdownPlugins.ts` 한 곳이 소유해 공개 상세(서버)와 어드민 미리보기(클라이언트)가 같은 규칙으로 돈다.

**Tech Stack:** Next 16 · React 19 · Tailwind v4 · Supabase · react-markdown · shiki · Vitest · Testing Library

설계: [2026-08-06-blog-redesign-design.md](../specs/2026-08-06-blog-redesign-design.md) · 구조: [folder-structure.md](../../conventions/folder-structure.md)

## Global Constraints

- 공개 페이지는 `createSupabaseStaticClient` 로 **직접** 조회한다. `/api/posts` 를 경유하지 않는다.
- `PostContent` 는 **서버 전용**이다. `'use client'` 를 붙이면 공개 상세가 shiki 번들을 지고 간다.
- 목차 슬러그는 `github-slugger` 로 만든다. 직접 정규화하지 않는다.
- 어드민 쓰기 라우트는 성공 응답 전에 `revalidatePath` 를 부른다.
- `describe`·`it` 설명문은 한국어, 고유 식별자만 영문.
- 주석은 파일 헤더와 export 에 단일 라인 JSDoc, 본문 비자명 로직에 한 줄 `//` 로 WHY.
- 각 태스크 끝에서 `npm run test` 와 `npm run type-check` 가 통과해야 한다.

---

## Task 1: post 도메인 순수 함수 3종

의존성이 없어 먼저 세운다. 이후 화면은 이 함수들의 소비자다.

**Files:**
- Create: `src/entities/post/lib/filterPosts.ts` · `filterPosts.test.ts`
- Create: `src/entities/post/lib/extractHeadings.ts` · `extractHeadings.test.ts`
- Create: `src/entities/post/lib/pickAdjacentPosts.ts` · `pickAdjacentPosts.test.ts`
- Modify: `src/entities/post/index.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `filterPosts(posts, params): PostListItem[]`, `extractHeadings(markdown): PostHeading[]`, `pickAdjacentPosts(posts, current): AdjacentPosts`

- [ ] **Step 1: github-slugger 설치**

```bash
npm install github-slugger
```

- [ ] **Step 2: 실패하는 테스트 3벌 작성**

`filterPosts.test.ts` — 세 조건이 AND 로 겹치는지, 검색이 제목·설명·태그를 대소문자 구분 없이 보는지, 빈 조건이 전체를 돌려주는지.

`extractHeadings.test.ts` — `##`/`###` 깊이, 코드 펜스 안의 `#` 을 제목으로 세지 않는지, 같은 제목이 두 번 나오면 슬러그가 갈리는지(`rehype-slug` 와 같은 동작).

`pickAdjacentPosts.test.ts` — 시리즈 글은 같은 시리즈 안에서만 잇는지, 단발 글은 전체에서 잇는지, 목록 양 끝에서 `null` 인지.

- [ ] **Step 3: 테스트가 실패하는지 확인**

Run: `npx vitest run src/entities/post/lib`
Expected: FAIL — 모듈 해석 실패

- [ ] **Step 4: `filterPosts` 작성**

```ts
/** 공개 목록 필터 — 정적 생성이라 거르는 일은 브라우저가 한다(서버 쿼리가 아니다) */
import type { PostListItem, PostSearchParams } from '../model/post.types';

/** 검색어·태그·시리즈를 AND 로 겹쳐 목록을 좁힌다 */
export const filterPosts = (
  posts: PostListItem[],
  params: PostSearchParams
): PostListItem[] => {
  const term = params.q?.trim().toLowerCase();

  return posts.filter((post) => {
    if (params.series && post.series !== params.series) {
      return false;
    }

    if (params.tag && !post.tags.includes(params.tag)) {
      return false;
    }

    if (!term) {
      return true;
    }

    // 본문은 넣지 않는다 — 목록 페이로드가 글 수에 비례해 부푼다
    return [post.title, post.description, ...post.tags]
      .join(' ')
      .toLowerCase()
      .includes(term);
  });
};
```

- [ ] **Step 5: `extractHeadings` 작성**

```ts
/** 목차 추출 — 슬러그는 rehype-slug 와 같은 구현을 써야 앵커가 맞는다 */
import GithubSlugger from 'github-slugger';

/** 목차 항목 하나 */
export type PostHeading = {
  depth: 2 | 3;
  text: string;
  id: string;
};

const FENCE = /^\s*(?:```|~~~)/;
const HEADING = /^(#{2,3})\s+(.+?)\s*#*\s*$/;

/** 본문에서 h2·h3 를 순서대로 뽑는다 */
export const extractHeadings = (markdown: string): PostHeading[] => {
  // slugger 는 중복 제목에 -1, -2 를 붙이며 상태를 쌓는다 — 글마다 새로 만들어야 한다
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  let insideFence = false;

  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      insideFence = !insideFence;
      continue;
    }

    // 코드 블록 안의 주석(#)이 목차에 올라오는 것을 막는다
    if (insideFence) {
      continue;
    }

    const match = HEADING.exec(line);

    if (!match) {
      continue;
    }

    headings.push({
      depth: match[1].length as 2 | 3,
      text: match[2],
      id: slugger.slug(match[2]),
    });
  }

  return headings;
};
```

- [ ] **Step 6: `pickAdjacentPosts` 작성**

```ts
/** 앞뒤 글 선택 — 목록 데이터로 계산해 추가 조회를 만들지 않는다 */
import type { PostListItem } from '../model/post.types';

/** 시간 흐름 기준 앞뒤 글 */
export type AdjacentPosts = {
  previous: PostListItem | null;
  next: PostListItem | null;
};

/** 시리즈 글은 같은 연재 안에서, 단발 글은 전체에서 앞뒤를 고른다 */
export const pickAdjacentPosts = (
  posts: PostListItem[],
  current: PostListItem
): AdjacentPosts => {
  // 시리즈를 벗어나 이으면 "다음 화"라는 약속이 깨진다
  const scope = current.series
    ? posts.filter((post) => {
        return post.series === current.series;
      })
    : posts;

  const index = scope.findIndex((post) => {
    return post.id === current.id;
  });

  if (index === -1) {
    return { previous: null, next: null };
  }

  // posts 는 최신 발행일 순이라 배열 뒤쪽이 과거다
  return {
    previous: scope[index + 1] ?? null,
    next: scope[index - 1] ?? null,
  };
};
```

- [ ] **Step 7: 공개 API 추가**

`src/entities/post/index.ts` 에 세 함수와 `PostHeading` · `AdjacentPosts` 타입을 export 한다.

- [ ] **Step 8: 검증과 커밋**

Run: `npx vitest run src/entities/post/lib && npm run type-check && npm run fsd`

```bash
git add src/entities/post package.json package-lock.json
git commit -m "feat(post): add filtering, heading and adjacency helpers"
```

---

## Task 2: Markdown 렌더 기반

**Files:**
- Create: `src/entities/post/lib/markdownPlugins.ts`
- Create: `src/entities/post/ui/PostContent.tsx` · `PostContent.test.tsx`
- Create: `src/shared/styles/prose.css`
- Modify: `src/shared/styles/global.css`, `src/entities/post/index.ts`, `package.json`

**Interfaces:**
- Produces: `REMARK_PLUGINS`, `REHYPE_PLUGINS`, `PostContent({ markdown }: { markdown: string })`

- [ ] **Step 1: 패키지 설치**

```bash
npm install react-markdown remark-gfm rehype-slug @shikijs/rehype shiki
```

- [ ] **Step 2: 동기 하이라이터 API 가 실제로 있는지 확인**

react-markdown 은 파이프라인을 동기로 돌려 async 플러그인을 못 받는다. 아래 두 진입점이 없으면 **여기서 멈추고 보고한다** — 파이프라인 형태를 다시 정해야 한다.

```bash
node -e "const c=require('shiki/core');console.log(typeof c.createHighlighterCoreSync)"
ls node_modules/@shikijs/rehype/dist/core.mjs
```

Expected: `function` 출력, 파일 존재

- [ ] **Step 3: 플러그인 모듈 작성**

```ts
/** Markdown 렌더 규칙 한 벌 — 공개 상세와 어드민 미리보기가 같은 규칙으로 돌게 한 곳에 모은다 */
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

// 언어를 명시적으로 싣는다 — 전체 번들은 수 MB 라 어드민 클라이언트가 통째로 지게 된다
const highlighter = createHighlighterCoreSync({
  themes: [await import('shiki/themes/github-light.mjs')],
  langs: [/* typescript · tsx · javascript · json · bash · css · sql · markdown */],
  engine: createJavaScriptRegexEngine(),
});

/** 표·취소선·자동 링크 */
export const REMARK_PLUGINS = [remarkGfm];

/** 제목 id 부여 + 코드 하이라이팅 (라이트 테마 한 벌만 쓴다 — 블로그는 라이트 고정이다) */
export const REHYPE_PLUGINS = [
  rehypeSlug,
  [rehypeShikiFromHighlighter, highlighter, { theme: 'github-light' }],
];
```

> 언어·테마 import 는 동기 형태여야 한다(`import ts from 'shiki/langs/typescript.mjs'`). 위 `await import` 는 자리 표시이므로 실제 작성 시 정적 import 로 바꾸고, 동기 생성자가 받는 형태를 타입으로 확인한다.

- [ ] **Step 4: 실패하는 테스트 작성**

`PostContent.test.tsx` — Markdown 이 시맨틱 태그로 나오는지(`## 제목` → `h2`), 제목에 `id` 가 붙는지, GFM 표가 `table` 로 나오는지.

- [ ] **Step 5: `PostContent` 작성**

```tsx
/** 글 본문 렌더 — 서버 전용이다('use client' 를 붙이면 공개 상세가 shiki 번들을 지고 간다) */
import Markdown from 'react-markdown';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../lib/markdownPlugins';

/** content_markdown 을 조판된 본문으로 그린다 */
export function PostContent({ markdown }: { markdown: string }) {
  return (
    <div className='prose-post'>
      <Markdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}>
        {markdown}
      </Markdown>
    </div>
  );
}
```

- [ ] **Step 6: 본문 조판 작성**

`src/shared/styles/prose.css` 에 `@utility prose-post` 하나를 만든다. 태그 기준으로 잡고, 값은 기존 토큰(`--text-body-lg` · `--text-statement` · `--color-muted` · `--color-accent` · `--radius-md`)에서 가져온다. 새 토큰을 만들지 않는다.

덮을 태그: `h2` · `h3` · `p` · `ul`/`ol`/`li` · `blockquote` · `pre`/`code` · `a` · `img` · `table`/`th`/`td` · `hr`.

`global.css` 의 `@import './motion.css';` 다음 줄에 `@import './prose.css';` 를 넣는다.

- [ ] **Step 7: 검증과 커밋**

Run: `npm run test && npm run type-check && npm run lint`

```bash
git add src/entities/post src/shared/styles package.json package-lock.json
git commit -m "feat(post): render markdown with syntax highlighting"
```

---

## Task 3: 공개 상세 — `/blog/[slug]`

**Files:**
- Create: `app/blog/[slug]/page.tsx`
- Create: `src/pages/blog-post/index.ts`, `ui/BlogPostPage.tsx`, `ui/PostToc/PostToc.tsx`, `ui/PostNav/PostNav.tsx`

**Interfaces:**
- Consumes: `getPublishedPostBySlug`, `getPublishedPosts`, `getPublishedPostSlugs`, `extractHeadings`, `pickAdjacentPosts`, `PostContent`
- Produces: `BlogPostPage({ slug }: { slug: string })`

- [ ] **Step 1: 라우트 껍데기 작성**

`app/blog/[slug]/page.tsx` 에 `generateStaticParams`(= `getPublishedPostSlugs`), `generateMetadata`(title·description·openGraph), 그리고 `BlogPostPage` re-export 를 둔다. 글이 없으면 `notFound()`.

`dynamicParams` 는 기본값 그대로 둔다 — 빌드 뒤 발행된 글도 첫 요청에 생성되고, draft 는 RLS 가 막아 404 가 된다.

- [ ] **Step 2: `BlogPostPage` 작성**

`data-surface='light'` 로 뒤집고 `min-h-svh` 를 채운다(뒤로 body 다크가 비치지 않게). 조회는 두 번이다 — 본문 하나와 앞뒤 계산용 전체 목록. 빌드 시점이라 요청 비용이 없다.

구성: 제목 · 발행일 · 태그 → 목차 → 본문(`PostContent`) → `PostNav` → `SiteFooter`(main 밖).

- [ ] **Step 3: `PostToc` 작성**

`extractHeadings` 결과를 `#{id}` 링크 목록으로 그린다. `lg` 이상에서 본문 옆 sticky, 미만에서는 본문 위 `<details>` 로 접는다. 항목이 없으면 아무것도 그리지 않는다.

- [ ] **Step 4: `PostNav` 작성**

`pickAdjacentPosts` 결과를 이전/다음 링크로 그린다. 시리즈 글이면 시리즈 이름을 함께 보여준다. 양쪽 다 `null` 이면 그리지 않는다.

- [ ] **Step 5: 눈으로 확인**

```bash
npm run dev
```

`http://localhost:3000/blog/hello-post`(seed 글)에서 본문 조판 · 코드 색 · 목차 링크 이동 · 앞뒤 내비를 본다. 없는 slug 로 들어가 404 인지도 본다.

- [ ] **Step 6: 검증과 커밋**

Run: `npm run test && npm run type-check && npm run fsd && npm run build`

```bash
git add app/blog src/pages/blog-post
git commit -m "feat(blog): add post detail page with toc and adjacent nav"
```

---

## Task 4: 공개 목록 — `/blog`

**Files:**
- Modify: `src/pages/blog/ui/BlogPage.tsx`
- Create: `src/pages/blog/ui/PostBrowser/PostBrowser.tsx` · `PostBrowser.test.tsx`, `ui/PostCard/PostCard.tsx`

- [ ] **Step 1: `BlogPage` 를 실제 목록으로 바꾼다**

`createSupabaseStaticClient` + `getPublishedPosts` 로 전체 목록을 읽어 `PostBrowser` 에 넘긴다. 태그·시리즈 선택지도 여기서 뽑아 넘긴다(목록을 두 번 훑지 않게).

- [ ] **Step 2: 실패하는 테스트 작성**

`PostBrowser.test.tsx` — 검색어 입력이 목록을 줄이는지, 태그를 고르면 그 태그 글만 남는지, 조건을 지우면 전체가 돌아오는지.

- [ ] **Step 3: `PostBrowser` 작성**

`'use client'`. 필터 상태는 URL 쿼리(`?q=` · `?tag=` · `?series=`)에 산다 — 공유·북마크·뒤로가기가 성립한다. `useSearchParams` 를 쓰므로 **`BlogPage` 에서 Suspense 경계로 감싼다.** 경계 없이 정적 페이지에서 쓰면 빌드가 막힌다.

거르는 일은 `filterPosts` 에 맡긴다. 이 컴포넌트는 입력과 URL 동기화만 한다.

시리즈 묶음은 목록 상단에 둔다 — `series` 가 같은 글을 모으고 `null` 인 글은 묶지 않는다.

- [ ] **Step 4: `PostCard` 작성**

제목 · 설명 · 발행일 · 태그. 태그는 클릭하면 그 태그로 걸러지는 링크다.

- [ ] **Step 5: 눈으로 확인**

```bash
npm run dev
```

`/blog` 에서 검색·태그·시리즈가 각각 목록을 줄이는지, 조건이 URL 에 남는지, 뒤로가기가 이전 조건으로 돌아가는지 본다. 375px 폭에서 가로 오버플로가 없는지도 본다.

- [ ] **Step 6: 검증과 커밋**

Run: `npm run test && npm run type-check && npm run fsd && npm run build`

```bash
git add src/pages/blog
git commit -m "feat(blog): add post list with tag, search and series filters"
```

---

## Task 5: sitemap · 죽은 fetcher 정리

**Files:**
- Modify: `app/sitemap.ts`, `src/entities/post/index.ts`
- Delete: `src/entities/post/api/publicPosts.ts`

- [ ] **Step 1: sitemap 에 글 URL 을 붙인다**

`sitemap()` 을 async 로 바꾸고 `getPublishedPostSlugs` 로 `/blog/{slug}` 항목을 붙인다. 정적 4개 경로는 그대로 둔다.

- [ ] **Step 2: 소비자가 정말 0인지 확인**

```bash
grep -rn "fetchPublishedPost" src app
```

Expected: `publicPosts.ts` 와 `entities/post/index.ts` 만. 다른 소비자가 나오면 멈추고 보고한다.

- [ ] **Step 3: 삭제와 배럴 정리**

```bash
rm src/entities/post/api/publicPosts.ts
```

`index.ts` 에서 `fetchPublishedPostFromApi` · `fetchPublishedPostsFromApi` export 를 지운다. `/api/posts` Route Handler 자체는 **남긴다**(외부 공개 API).

- [ ] **Step 4: 검증과 커밋**

Run: `npm run test && npm run type-check && npm run fsd && npm run build`

```bash
git add app/sitemap.ts src/entities/post
git commit -m "feat(blog): list posts in sitemap and drop unused api fetcher"
```

---

## Task 6: 삭제 API · 재검증 배선

**Files:**
- Modify: `src/entities/post/api/adminPosts.ts` · `adminPosts.test.ts`, `src/entities/post/index.ts`
- Modify: `app/api/admin/posts/route.ts` · `route.test.ts`, `app/api/admin/posts/[id]/route.ts` · `route.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`adminPosts.test.ts` 에 `deleteAdminPost` 케이스를, `[id]/route.test.ts` 에 DELETE 케이스(가드 거부 · 성공 · 에러 매핑)를 추가한다.

라우트 테스트에 재검증 단언을 넣는다 — `next/cache` 를 mock 해 `revalidatePath` 가 `/blog` · `/blog/{slug}` · `/sitemap.xml` 로 불렸는지 본다.

- [ ] **Step 2: `deleteAdminPost` 작성**

`.delete().eq('id', id)` 로 지우고, 재검증에 slug 가 필요하므로 `.select('slug').single()` 로 지워진 행을 받아 돌려준다.

- [ ] **Step 3: 세 라우트에 재검증을 붙인다**

```ts
// SDK 직접 조회는 fetch 캐시를 안 타 태그가 안 걸린다 — 경로를 직접 지목해 다시 굽는다
const revalidatePost = (slug: string) => {
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/sitemap.xml');
};
```

POST · PUT · DELETE 가 성공 응답 직전에 부른다. 수정에서 slug 가 바뀌었으면 **옛 slug 도** 함께 지목한다 — 안 그러면 옛 경로가 옛 내용으로 남는다.

- [ ] **Step 4: 검증과 커밋**

Run: `npm run test && npm run type-check`

```bash
git add src/entities/post app/api/admin
git commit -m "feat(admin): add post deletion and revalidate public pages on write"
```

---

## Task 7: 어드민 인가 골격 — 로그인 + protected layout

**Files:**
- Create: `app/admin/login/page.tsx`, `app/admin/(protected)/layout.tsx`
- Create: `src/pages/admin-login/index.ts`, `ui/AdminLoginPage.tsx` · `AdminLoginPage.test.tsx`
- Modify: `app/robots.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`AdminLoginPage.test.tsx` — 이메일·비밀번호 입력과 제출이 `signIn` 을 부르는지, 실패 메시지가 폼에 남는지.

- [ ] **Step 2: `AdminLoginPage` 작성**

`'use client'`. 기존 `useSignIn`(`features/auth`)을 그대로 쓴다 — 성공 시 `/admin/posts` 로 보내는 로직이 이미 안에 있다. 어드민도 `data-surface='light'` 로 둔다.

- [ ] **Step 3: `(protected)/layout.tsx` 작성**

서버에서 `createSupabaseServerClient().auth.getUser()` 로 세션과 `app_metadata.role` 을 재확인한다. 비로그인은 `/admin/login` 으로 redirect, 로그인했지만 비admin 은 403 화면.

**proxy 만 믿지 않는다** — matcher 를 벗어난 경로가 생기면 조용히 열린다. proxy 는 UX 용 optimistic redirect 고, 이 layout 이 화면 접근의 집행자다.

- [ ] **Step 4: robots 에서 어드민을 내린다**

`app/robots.ts` 의 규칙에 `disallow: '/admin'` 을 더한다. 색인은 접근 제어가 아니지만, 로그인 화면이 검색 결과에 뜰 이유가 없다.

- [ ] **Step 5: 눈으로 확인**

```bash
npm run auth:seed-admin-local   # 로컬 어드민 계정 (supabase db reset 뒤엔 재실행)
npm run dev
```

비로그인으로 `/admin/posts` → `/admin/login` 리다이렉트, 로그인 성공 → `/admin/posts` 이동을 본다. (아직 목록 화면이 없어 404 여도 리다이렉트 자체는 확인된다.)

- [ ] **Step 6: 검증과 커밋**

Run: `npm run test && npm run type-check && npm run fsd`

```bash
git add app/admin app/robots.ts src/pages/admin-login
git commit -m "feat(admin): restore login page and server-side route guard"
```

---

## Task 8: 어드민 글 목록

**Files:**
- Create: `app/admin/(protected)/posts/page.tsx`
- Create: `src/pages/admin-posts/index.ts`, `ui/AdminPostsPage.tsx`

- [ ] **Step 1: `AdminPostsPage` 작성**

서버 컴포넌트. `createSupabaseServerClient` 로 **draft 포함 전체**를 읽는다(RLS 가 admin 세션에 쓰기·읽기를 허용하는 범위를 통합 테스트로 이미 확인해 둔 지점이다). 상태별로 나눠 보여주고, 각 행에서 수정으로 간다. 상단에 "새 글" 링크.

- [ ] **Step 2: 눈으로 확인**

`/admin/posts` 에서 seed 글과 상태가 보이는지 본다.

- [ ] **Step 3: 검증과 커밋**

Run: `npm run test && npm run type-check && npm run fsd`

```bash
git add app/admin src/pages/admin-posts
git commit -m "feat(admin): list posts with draft and published status"
```

---

## Task 9: 어드민 에디터 · 미리보기 · 이미지 업로드

**Files:**
- Create: `app/admin/(protected)/posts/new/page.tsx`, `posts/[id]/page.tsx`
- Create: `src/pages/admin-post-editor/index.ts`, `ui/AdminPostEditorPage.tsx` · 테스트, `ui/MarkdownPreview/MarkdownPreview.tsx`
- Create: `src/features/manage-post/index.ts`, `api/savePost.ts`, `api/deletePost.ts`, `api/uploadPostImage.ts`, `model/usePostEditor.ts`

**Interfaces:**
- Produces: `savePost(input, id?)`, `deletePost(id)`, `uploadPostImage(file)`, `usePostEditor(initial?)`

- [ ] **Step 1: 실패하는 테스트 작성**

`AdminPostEditorPage.test.tsx` — 저장이 `UpsertPostInput` 계약대로 payload 를 보내는지(신규는 POST, 수정은 PUT), 실패 응답이 화면에 남는지, 삭제가 확인 단계를 거치는지.

- [ ] **Step 2: `manage-post` 액션 작성**

`savePost` 는 신규/수정을 `id` 유무로 가른다. `deletePost` 는 DELETE. `uploadPostImage` 는 `FormData` 로 `/api/admin/images` 에 보내고 public URL 을 받는다. 전부 `shared/api/http` 의 클라이언트를 쓴다.

- [ ] **Step 3: `usePostEditor` 작성**

제목 · slug · 설명 · 시리즈 · 태그 · 상태 · 발행일 · 본문을 plain state 로 관리한다(RHF 미사용 — `useSignIn` 과 같은 방식). 저장 중 pending 과 에러를 함께 노출한다.

- [ ] **Step 4: `MarkdownPreview` 작성**

`'use client'`. `markdownPlugins.ts` 의 **같은 플러그인 배열**을 쓰고 `prose-post` 를 그대로 입는다. `PostContent` 를 재사용하지 않는 이유는 그쪽이 서버 전용이기 때문이다 — 통일하려면 `'use client'` 를 붙여야 하고, 그러면 공개 상세까지 shiki 를 지고 간다.

- [ ] **Step 5: `AdminPostEditorPage` 작성**

좌측 입력창, 우측 미리보기. 이미지는 파일 선택 후 업로드하고 돌아온 URL 을 커서 위치에 `![alt](url)` 로 삽입한다. 수정 화면에만 삭제 버튼을 두고 확인 단계를 거친다.

- [ ] **Step 6: 라우트 껍데기 작성**

`new/page.tsx` 는 빈 에디터, `[id]/page.tsx` 는 서버에서 글을 읽어 초기값으로 넘긴다.

- [ ] **Step 7: 손으로 끝까지 확인**

```bash
npm run dev
```

로그인 → 새 글 작성 → 이미지 업로드 → 미리보기가 공개 조판과 같은지 → 초안 저장 → 발행 → **`/blog` 와 `/blog/{slug}` 에 재배포 없이 반영되는지** → 수정 → 삭제. 초안 slug 로 공개 경로에 직접 접근해 404 인지도 본다.

- [ ] **Step 8: 검증과 커밋**

Run: `npm run test && npm run type-check && npm run fsd && npm run build`

```bash
git add app/admin src/pages/admin-post-editor src/features/manage-post
git commit -m "feat(admin): add markdown editor with live preview and image upload"
```

---

## Task 10: 문서 갱신

**Files:**
- Modify: `docs/admin-auth-rollout.md`, `CLAUDE.md`

- [ ] **Step 1: 롤아웃 문서의 전제 갱신**

"지금은 서버 계층만 있다" 경고 블록을 걷어낸다. `/admin/login` 을 거치는 체크 항목이 이제 수행 가능하다.

- [ ] **Step 2: CLAUDE.md 에 블로그 렌더 규칙 한 줄 추가**

"홈의 스크롤 모션은 GSAP이 소유한다" 문단 옆에, 블로그 본문 렌더 규칙(서버 전용 `PostContent` · 플러그인 단일 출처 · 정적 생성 + `revalidatePath`)을 한 문단으로 넣고 스펙을 가리킨다. 에이전트가 이미 아는 일반론은 적지 않는다.

- [ ] **Step 3: 커밋**

```bash
git add docs CLAUDE.md
git commit -m "docs: update admin rollout and blog rendering rules"
```

---

## 마무리 검증

- [ ] `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build` 통과
- [ ] `npm run format` 실행 후 diff 확인
- [ ] `npm run test:integration` 통과 (로컬 Supabase 필요 — RLS 경계가 그대로인지)
- [ ] `/blog` 에서 검색·태그·시리즈가 각각 걸러지고 조건이 URL 에 남는다
- [ ] `/blog/[slug]` 에서 코드 색 · 목차 이동 · 앞뒤 내비가 동작한다
- [ ] 어드민에서 발행한 글이 재배포 없이 `/blog` 에 나타난다
- [ ] draft slug 직접 접근 시 404
- [ ] 브라우저 JS 끄고 `/blog/[slug]` — 본문이 전부 보인다
- [ ] 375 / 768 / 1440px 에서 가로 오버플로 없음
