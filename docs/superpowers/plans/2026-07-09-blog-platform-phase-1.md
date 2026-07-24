# Blog Platform Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 MDX 글을 Supabase로 이식하고, 원격 Supabase 기반 검색/SEO/이미지/admin editor까지 갖춘 1차 운영 블로그를 만든다.

**Architecture:** Next App Router는 `app/`에서 라우트 경계와 Route Handler만 맡고, 화면 조립은 `src/pages/*`, 사용자 행동은 `src/features/*`, post 도메인 query/write/renderer는 `src/entities/post/*`에 둔다. DB 변경은 `supabase/migrations/*.sql`이 source of truth이며, MDX 이식은 `scripts/blog-import/*`의 일회성 운영 스크립트로 처리한다.

**Tech Stack:** Next.js 16.2.9, React 19.2.3, Supabase JS 2.108.1, vanilla-extract, Vitest, CodeMirror 6 via `@uiw/react-codemirror`, `react-markdown`, `remark-gfm`, existing `rehype-*`, Shiki.

## 2026-07-09 Taxonomy Revision

This plan originally introduced `category` and `series`.
The accepted follow-up direction is tag-first:

- Drop `posts.category`, the category index, category query parsing, and category UI.
- Keep `series`, but import every current MDX post with `series: null`.
- Treat `tags` as required: import/editor validation rejects empty tag lists, and the DB has a non-empty `tags` check constraint.
- Defer nested multi-tag search to a later plan.

## Global Constraints

- FSD layer direction: `app -> pages -> widgets -> features -> entities -> shared`.
- `app/*/page.tsx` stays thin and re-exports from `@/pages/*` unless route metadata/searchParams handling requires a tiny wrapper.
- All public slice imports cross boundaries through `@/` and public `index.ts`.
- Every file and export follows `docs/conventions/comment-convention.md`.
- Use RED -> GREEN -> REFACTOR from `docs/conventions/tdd-convention.md`.
- No delete feature in phase 1.
- No Supabase Auth in phase 1.
- No arbitrary MDX component execution. Markdown is the source of truth.
- Existing `content/blog/*.mdx` remains archive/verification input after import.
- Remote DB changes go through `supabase db push --dry-run` before `supabase db push`.

---

## File Structure Map

- `supabase/migrations/*`
  Database schema, grants, RLS, indexes, and storage policy SQL.
- `src/shared/config/env.ts`
  local/remote env target resolver and server-only admin env values.
- `src/shared/api/supabase/admin.ts`
  service-role Supabase client for server-only admin write/upload paths.
- `src/entities/post/model/post.types.ts`
  app-facing `Post`, `PostListItem`, search params, editor input, and admin payload types.
- `src/entities/post/api/posts.ts`
  public post queries: list/search/detail/slugs/sitemap data.
- `src/entities/post/api/adminPosts.ts`
  server-only create/update/admin-read helpers using service role client.
- `src/entities/post/ui/PostMarkdown/*`
  Markdown renderer shared by public detail and admin preview.
- `src/features/post-filter/*`
  `/blog` search/filter UI and URL query helpers.
- `src/features/post-editor/*`
  CodeMirror editor, metadata form, preview, token handling, image upload, submit workflow.
- `src/pages/blog/*`
  public blog list page composition.
- `src/pages/blog-post/*`
  public blog detail page composition and metadata.
- `src/pages/admin-posts/*`
  admin list/new/edit page composition.
- `app/api/admin/posts/*`
  admin create/update HTTP boundaries.
- `app/api/admin/images/route.ts`
  image upload HTTP boundary.
- `scripts/blog-import/*`
  MDX import scripts. Current import rows come from MDX frontmatter only, with `series: null`.

---

### Task 0: Commit Current Supabase Groundwork Separately

**Files:**
- Modify: `.env.example`
- Modify: `src/shared/config/env.ts`
- Modify: `src/shared/config/env.test.ts`
- Create: `supabase/migrations/20260709121804_grant_public_posts_read.sql`

**Interfaces:**
- Produces: `readPublicEnv(source?)`, `readServerEnv(source?)` supporting `NEXT_PUBLIC_SUPABASE_TARGET=local | remote`.
- Produces: remote `public.posts` read grant already pushed by `supabase db push`.

- [ ] **Step 1: Verify current groundwork tests pass**

Run:

```bash
npx vitest run src/shared/config/env.test.ts
npm run type-check
npm run build
```

Expected:

```txt
src/shared/config/env.test.ts passes
tsc --noEmit passes
next build succeeds with /blog and /blog/[slug]
```

- [ ] **Step 2: Review migration content**

Check `supabase/migrations/20260709121804_grant_public_posts_read.sql`:

```sql
grant usage on type public.post_status to anon, authenticated;
grant select on table public.posts to anon, authenticated;
```

Expected: only public read privilege is granted; no insert/update/delete privilege is granted to anon.

- [ ] **Step 3: Commit groundwork**

Run:

```bash
git add .env.example src/shared/config/env.ts src/shared/config/env.test.ts supabase/migrations/20260709121804_grant_public_posts_read.sql
git commit -m "chore: configure Supabase environment targets"
```

Expected: one commit containing only env target support and public read grant migration.

---

### Task 1: Extend Posts Schema for Phase 1

**Files:**
- Create: `supabase/migrations/<timestamp>_extend_posts_for_blog_phase_1.sql`
- Modify: `src/shared/api/supabase/database.types.ts`
- Modify: `src/entities/post/model/post.types.ts`
- Test: `src/entities/post/api/posts.test.ts`

**Interfaces:**
- Produces DB columns: `category text not null`, `series text`, existing `tags text[]`.
- Produces TypeScript aliases:

```ts
export type PostCategory = string;
export type PostSeries = string | null;

export type PostSearchParams = {
  q?: string;
  category?: string;
  series?: string;
  tag?: string;
};
```

- [ ] **Step 1: Write failing type/query test for new fields**

Add assertions in `src/entities/post/api/posts.test.ts` that list queries can select:

```ts
expect(select).toHaveBeenCalledWith(
  'id, slug, title, description, tags, category, series, published_at'
);
```

Expected initial result: FAIL because the current list select omits `category` and `series`.

- [ ] **Step 2: Add migration**

Create `supabase/migrations/<timestamp>_extend_posts_for_blog_phase_1.sql`:

```sql
alter table public.posts
  add column if not exists category text not null default 'uncategorized',
  add column if not exists series text;

create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc);

create index if not exists posts_category_idx
  on public.posts (category);

create index if not exists posts_series_idx
  on public.posts (series);

create index if not exists posts_tags_idx
  on public.posts using gin (tags);
```

Expected: migration is additive and safe for existing remote rows.

- [ ] **Step 3: Apply locally and regenerate types**

Run:

```bash
supabase db reset
npm run db:types
```

Expected: `database.types.ts` includes `category` and `series` on `posts`.

- [ ] **Step 4: Update post aliases**

Update `src/entities/post/model/post.types.ts` so `PostListItem` includes:

```ts
export type PostListItem = Pick<
  Post,
  | 'id'
  | 'slug'
  | 'title'
  | 'description'
  | 'tags'
  | 'category'
  | 'series'
  | 'published_at'
>;
```

Expected: TypeScript recognizes the new fields from generated types.

- [ ] **Step 5: Verify**

Run:

```bash
npx vitest run src/entities/post/api/posts.test.ts
npm run type-check
```

Expected: targeted tests and type-check pass.

- [ ] **Step 6: Remote dry-run**

Run:

```bash
supabase db push --dry-run
```

Expected: only the new phase 1 schema migration is pending.

- [ ] **Step 7: Commit**

Run:

```bash
git add supabase/migrations src/shared/api/supabase/database.types.ts src/entities/post/model/post.types.ts src/entities/post/api/posts.test.ts
git commit -m "feat(blog): extend posts schema for search metadata"
```

---

### Task 2: Add Public Post Search Queries

**Files:**
- Modify: `src/entities/post/api/posts.ts`
- Modify: `src/entities/post/api/posts.test.ts`
- Modify: `src/entities/post/index.ts`

**Interfaces:**
- Consumes: `PostSearchParams`.
- Produces:

```ts
export const getPublishedPosts = async (
  client: SupabaseClient<Database>,
  params?: PostSearchParams
): Promise<PostListItem[]>;

export const getPublishedPostNavigationData = async (
  client: SupabaseClient<Database>
): Promise<PostListItem[]>;
```

- [ ] **Step 1: Write failing tests for filters**

Add tests for `category`, `series`, `tag`, and `q`.

Example expected call for category:

```ts
await getPublishedPosts(client, { category: 'frontend' });

expect(eq).toHaveBeenCalledWith('category', 'frontend');
```

Example expected call for text search:

```ts
await getPublishedPosts(client, { q: 'cache' });

expect(or).toHaveBeenCalledWith(
  'title.ilike.%cache%,description.ilike.%cache%,content_markdown.ilike.%cache%'
);
```

Expected initial result: FAIL because `getPublishedPosts` does not accept params.

- [ ] **Step 2: Implement query builder**

Update `getPublishedPosts` with this behavior:

```ts
let query = client
  .from('posts')
  .select(POST_LIST_SELECT)
  .eq('status', 'published')
  .order('published_at', { ascending: false });

if (params?.category) query = query.eq('category', params.category);
if (params?.series) query = query.eq('series', params.series);
if (params?.tag) query = query.contains('tags', [params.tag]);
if (params?.q) {
  const term = params.q.replaceAll('%', '\\%').replaceAll(',', ' ');
  query = query.or(
    `title.ilike.%${term}%,description.ilike.%${term}%,content_markdown.ilike.%${term}%`
  );
}
```

Expected: empty params preserve existing list behavior.

- [ ] **Step 3: Add navigation data query**

Add:

```ts
export const getPublishedPostNavigationData = async (
  client: SupabaseClient<Database>
): Promise<PostListItem[]> => {
  return getPublishedPosts(client);
};
```

Expected: sitemap/filter metadata can reuse the same list shape.

- [ ] **Step 4: Verify**

Run:

```bash
npx vitest run src/entities/post/api/posts.test.ts
npm run type-check
```

Expected: tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/entities/post
git commit -m "feat(blog): support published post filters"
```

---

### Task 3: Add Markdown Renderer Dependencies and Component

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/entities/post/ui/PostMarkdown/PostMarkdown.tsx`
- Create: `src/entities/post/ui/PostMarkdown/PostMarkdown.css.ts`
- Create: `src/entities/post/ui/PostMarkdown/PostMarkdown.test.tsx`
- Modify: `src/entities/post/index.ts`

**Interfaces:**
- Produces:

```ts
export type PostMarkdownProps = {
  source: string;
};

export function PostMarkdown({ source }: PostMarkdownProps): React.ReactElement;
```

- [ ] **Step 1: Install dependencies**

Run:

```bash
npm install react-markdown remark-gfm
```

Expected: `package.json` and `package-lock.json` include `react-markdown` and `remark-gfm`.

- [ ] **Step 2: Write failing renderer test**

Create `src/entities/post/ui/PostMarkdown/PostMarkdown.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostMarkdown } from './PostMarkdown';

describe('PostMarkdown', () => {
  it('Markdown heading, link, and code block을 렌더한다', () => {
    render(
      <PostMarkdown
        source={
          '## 제목\\n\\n[링크](https://limjaejoon.com)\\n\\n```ts\\nconst value = 1;\\n```'
        }
      />
    );

    expect(screen.getByRole('heading', { name: '제목' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '링크' })).toHaveAttribute(
      'href',
      'https://limjaejoon.com'
    );
    expect(screen.getByText('const value = 1;')).toBeInTheDocument();
  });
});
```

Expected initial result: FAIL because component does not exist.

- [ ] **Step 3: Implement renderer**

Create `PostMarkdown.tsx`:

```tsx
/** 공개 글과 editor preview가 공유하는 Markdown renderer */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as s from './PostMarkdown.css';

export type PostMarkdownProps = {
  source: string;
};

/** Markdown 원문을 안전한 React tree로 렌더링한다 */
export function PostMarkdown({ source }: PostMarkdownProps) {
  return (
    <div className={s.root}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  );
}
```

Expected: GFM basics render. Existing `rehype-*` integration can be added in the refactor step after baseline passes.

- [ ] **Step 4: Add styles**

Create `PostMarkdown.css.ts` with typography, code block overflow, image sizing, table overflow.

Expected: long code and wide tables do not break layout.

- [ ] **Step 5: Export public API**

Update `src/entities/post/index.ts`:

```ts
export { PostMarkdown } from './ui/PostMarkdown/PostMarkdown';
export type { PostMarkdownProps } from './ui/PostMarkdown/PostMarkdown';
```

- [ ] **Step 6: Verify**

Run:

```bash
npx vitest run src/entities/post/ui/PostMarkdown
npm run type-check
```

Expected: targeted tests pass.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/entities/post
git commit -m "feat(blog): add shared Markdown renderer"
```

---

### Task 4: Replace Blog Detail MDXRemote with PostMarkdown

**Files:**
- Modify: `src/pages/blog-post/ui/BlogPostPage.tsx`
- Modify: `src/pages/blog-post/ui/BlogPostPage.css.ts`
- Modify: `src/pages/blog-post/ui/BlogPostPage.test.tsx`

**Interfaces:**
- Consumes: `PostMarkdown`.
- Produces: blog detail renders `post.content_markdown` through shared Markdown renderer.

- [ ] **Step 1: Update failing test expectation**

Change `BlogPostPageView` test to assert markdown is delegated:

```tsx
expect(screen.getByRole('heading', { name: 'zshrc 제목' })).toBeInTheDocument();
expect(screen.getByText('본문입니다.')).toBeInTheDocument();
```

Expected before implementation: current MDXRemote may still pass. Add a code block/table fixture if needed to prove PostMarkdown-specific behavior.

- [ ] **Step 2: Remove MDXRemote import**

Replace:

```tsx
const content = await MDXRemote({ source: post.content_markdown });
```

with:

```tsx
<PostMarkdown source={post.content_markdown} />
```

Expected: `BlogPostPageView` no longer needs to be `async` unless other awaited work remains.

- [ ] **Step 3: Simplify detail styles**

Remove global Markdown styles from `BlogPostPage.css.ts` that moved into `PostMarkdown.css.ts`.

Expected: detail page owns layout; renderer owns prose.

- [ ] **Step 4: Verify**

Run:

```bash
npx vitest run src/pages/blog-post/ui/BlogPostPage.test.tsx
npm run type-check
```

Expected: tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/blog-post
git commit -m "refactor(blog): render posts as Markdown"
```

---

### Task 5: Build Public Search and Filter Page

**Files:**
- Create: `src/features/post-filter/index.ts`
- Create: `src/features/post-filter/model/searchParams.ts`
- Create: `src/features/post-filter/model/searchParams.test.ts`
- Create: `src/features/post-filter/ui/PostFilterForm/PostFilterForm.tsx`
- Create: `src/features/post-filter/ui/PostFilterForm/PostFilterForm.css.ts`
- Create: `src/features/post-filter/ui/PostFilterForm/PostFilterForm.test.tsx`
- Modify: `src/pages/blog/ui/BlogPage.tsx`
- Modify: `src/pages/blog/ui/BlogPage.css.ts`
- Modify: `src/pages/blog/ui/BlogPage.test.tsx`
- Modify: `app/blog/page.tsx`

**Interfaces:**
- Produces:

```ts
export const parsePostSearchParams = (
  input: Record<string, string | string[] | undefined>
) => PostSearchParams;

export type PostFilterOption = {
  label: string;
  value: string;
};
```

- [ ] **Step 1: Write search param parser tests**

Create tests:

```ts
expect(parsePostSearchParams({ q: ' cache ', tag: ['Next.js'] })).toEqual({
  q: 'cache',
  tag: 'Next.js',
});
```

Expected initial result: FAIL because parser does not exist.

- [ ] **Step 2: Implement parser**

Implement first-string extraction and trim:

```ts
const first = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};
```

Expected: empty strings are omitted.

- [ ] **Step 3: Update BlogPage props**

Change page API:

```ts
type BlogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function BlogPage({ searchParams }: BlogPageProps = {}) {
  const params = parsePostSearchParams((await searchParams) ?? {});
  const posts = await getPublishedPosts(client, params);
  return <BlogPageView posts={posts} filters={params} />;
}
```

Expected: `app/blog/page.tsx` can re-export default if prop signature is compatible.

- [ ] **Step 4: Add PostFilterForm**

Use a GET form so filters are shareable by URL:

```tsx
<form action="/blog" method="get">
  <input name="q" defaultValue={filters.q ?? ''} />
  <select name="category" defaultValue={filters.category ?? ''} />
  <select name="series" defaultValue={filters.series ?? ''} />
  <input name="tag" defaultValue={filters.tag ?? ''} />
  <button type="submit">검색</button>
</form>
```

Expected: no client JS is required for phase 1 filtering.

- [ ] **Step 5: Add empty result UI**

When `posts.length === 0`, render:

```tsx
<p role="status">조건에 맞는 글이 없습니다.</p>
```

Expected: search result state is accessible.

- [ ] **Step 6: Verify**

Run:

```bash
npx vitest run src/features/post-filter src/pages/blog/ui/BlogPage.test.tsx
npm run fsd
npm run type-check
```

Expected: tests, FSD, and type-check pass.

- [ ] **Step 7: Commit**

```bash
git add app/blog/page.tsx src/features/post-filter src/pages/blog
git commit -m "feat(blog): add Supabase-backed filters"
```

---

### Task 6: Expand SEO and Sitemap

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `src/pages/blog-post/ui/BlogPostPage.tsx`
- Modify: `src/pages/blog-post/ui/BlogPostPage.test.tsx`
- Modify: `app/sitemap.ts`
- Create: `app/sitemap.test.ts`

**Interfaces:**
- Consumes: `getPublishedPostNavigationData`.
- Produces: sitemap rows for published posts and blog route.

- [ ] **Step 1: Write sitemap test**

Create `app/sitemap.test.ts` mocking post navigation data:

```ts
expect(await sitemap()).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ url: 'https://limjaejoon.com/blog' }),
    expect.objectContaining({
      url: 'https://limjaejoon.com/blog/2026-04-06-next-fetch',
    }),
  ])
);
```

Expected initial result: FAIL because sitemap currently includes only home.

- [ ] **Step 2: Update sitemap**

Make sitemap async:

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createSupabaseStaticClient();
  const posts = await getPublishedPostNavigationData(client);
  return [...staticRoutes, ...postRoutes];
}
```

Expected: only published post data is used.

- [ ] **Step 3: Add list metadata**

In `app/blog/page.tsx`, export:

```ts
export const metadata: Metadata = {
  title: '기술 블로그',
  description: '프론트엔드와 제품 개발 과정에서 쌓은 기술 기록',
  alternates: { canonical: '/blog' },
};
```

- [ ] **Step 4: Expand detail metadata**

In `generateMetadata`, add:

```ts
alternates: { canonical: `/blog/${post.slug}` },
openGraph: {
  title: post.title,
  description: post.description,
  type: 'article',
  url: `/blog/${post.slug}`,
  publishedTime: post.published_at ?? undefined,
  tags: post.tags,
},
twitter: {
  card: 'summary_large_image',
  title: post.title,
  description: post.description,
},
```

Expected: detail metadata includes canonical and social basics.

- [ ] **Step 5: Verify**

Run:

```bash
npx vitest run app/sitemap.test.ts src/pages/blog-post/ui/BlogPostPage.test.tsx
npm run build
```

Expected: build succeeds and sitemap route is static.

- [ ] **Step 6: Commit**

```bash
git add app/blog/page.tsx app/sitemap.ts app/sitemap.test.ts src/pages/blog-post
git commit -m "feat(blog): include posts in SEO metadata"
```

---

### Task 7: Create MDX Import Script

**Files:**
- Create: `scripts/blog-import/postMetadataOverrides.mjs`
- Create: `scripts/blog-import/importPosts.mjs`
- Create: `scripts/blog-import/importPosts.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces CLI:

```bash
npm run blog:import -- --target=local
npm run blog:import -- --target=remote
```

- Produces import row shape:

```js
{
  slug,
  title,
  description,
  content_markdown,
  tags,
  category,
  series,
  status: 'published',
  published_at: `${date}T00:00:00.000Z`
}
```

- [ ] **Step 1: Add parser test**

Create a Node test that parses a fixture string with `gray-matter`:

```js
assert.equal(row.slug, '2026-04-06-next-fetch');
assert.equal(row.category, 'frontend');
assert.deepEqual(row.tags, ['Next.js', '캐싱']);
```

Expected initial result: FAIL because importer does not exist.

- [ ] **Step 2: Create metadata overrides**

Add mappings for all 28 current slugs. Example:

```js
export const postMetadataOverrides = {
  '2026-04-06-next-fetch': {
    category: 'frontend',
    series: 'Next.js App Router',
  },
  '2026-05-17-fiber': {
    category: 'frontend',
    series: 'React Internals',
  },
};
```

Expected: every file from `content/blog` has category. `series` may be `null`.

- [ ] **Step 3: Implement importer**

Read `.env.local`, resolve target env, create Supabase client with service role, and upsert rows on `slug`.

Use:

```js
const { data, error } = await supabase
  .from('posts')
  .upsert(rows, { onConflict: 'slug' })
  .select('slug');
```

Expected: script prints counts only, never prints secret env values.

- [ ] **Step 4: Add package script**

Update `package.json`:

```json
"blog:import": "node scripts/blog-import/importPosts.mjs"
```

- [ ] **Step 5: Verify local dry run mode**

Support:

```bash
npm run blog:import -- --target=local --dry-run
```

Expected: prints 28 rows to import and exits without network write.

- [ ] **Step 6: Verify tests**

Run:

```bash
node --test scripts/blog-import/importPosts.test.mjs
npm run type-check
```

Expected: parser tests pass.

- [ ] **Step 7: Commit**

```bash
git add package.json scripts/blog-import
git commit -m "feat(blog): add MDX import script"
```

---

### Task 8: Add Server Admin Supabase Client and Token Guard

**Files:**
- Modify: `src/shared/config/env.ts`
- Modify: `src/shared/config/env.test.ts`
- Create: `src/shared/api/supabase/admin.ts`
- Modify: `src/shared/api/supabase/index.ts`
- Create: `src/shared/api/admin/auth.ts`
- Create: `src/shared/api/admin/auth.test.ts`

**Interfaces:**
- Produces:

```ts
export type ServerEnv = PublicEnv & {
  supabaseServiceRoleKey: string;
  postImageBucket: string;
  adminPostToken: string;
};

export const createSupabaseAdminClient = () => SupabaseClient<Database>;

export const verifyAdminPostToken = (
  received: string | null,
  expected: string
) => boolean;
```

- [ ] **Step 1: Write env tests for admin values**

Add expected values:

```ts
expect(readServerEnv(profiledEnv)).toEqual({
  supabaseUrl: 'https://remote.supabase.co',
  supabaseAnonKey: 'remote-anon-key',
  supabaseServiceRoleKey: 'remote-service-role-key',
  postImageBucket: 'post-images',
  adminPostToken: 'admin-token',
});
```

Expected initial result: FAIL because env reader does not return bucket/token.

- [ ] **Step 2: Update env reader**

Resolve bucket by target:

```ts
local: 'LOCAL_POST_IMAGE_BUCKET'
remote: 'REMOTE_POST_IMAGE_BUCKET'
```

Resolve token globally:

```ts
adminPostToken: requireEnv(source, 'ADMIN_POST_TOKEN')
```

Expected: public env remains unchanged; server env gets admin-only fields.

- [ ] **Step 3: Write token guard tests**

Create `auth.test.ts`:

```ts
expect(verifyAdminPostToken('secret', 'secret')).toBe(true);
expect(verifyAdminPostToken('wrong', 'secret')).toBe(false);
expect(verifyAdminPostToken(null, 'secret')).toBe(false);
```

Expected initial result: FAIL because guard does not exist.

- [ ] **Step 4: Implement token guard**

Use `crypto.timingSafeEqual` for equal-length strings and return false on missing/mismatched length.

Expected: no token value is logged.

- [ ] **Step 5: Add admin client**

Create:

```ts
/** 서버 전용 Supabase admin client — service role key로 RLS를 우회한다 */
export const createSupabaseAdminClient = () => {
  const env = readServerEnv();
  return createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey);
};
```

Expected: this file is only imported by Route Handlers/server scripts.

- [ ] **Step 6: Verify**

Run:

```bash
npx vitest run src/shared/config/env.test.ts src/shared/api/admin/auth.test.ts
npm run type-check
```

Expected: tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/shared/config src/shared/api
git commit -m "feat(admin): add server Supabase credentials"
```

---

### Task 9: Add Admin Post API

**Files:**
- Create: `src/entities/post/api/adminPosts.ts`
- Create: `src/entities/post/api/adminPosts.test.ts`
- Modify: `src/entities/post/index.ts`
- Create: `app/api/admin/posts/route.ts`
- Create: `app/api/admin/posts/route.test.ts`
- Create: `app/api/admin/posts/[id]/route.ts`
- Create: `app/api/admin/posts/[id]/route.test.ts`

**Interfaces:**
- Produces:

```ts
export type UpsertPostInput = {
  title: string;
  slug: string;
  description: string;
  category: string;
  series: string | null;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  content_markdown: string;
};

export const createAdminPost = async (
  client: SupabaseClient<Database>,
  input: UpsertPostInput
): Promise<Post>;

export const updateAdminPost = async (
  client: SupabaseClient<Database>,
  id: string,
  input: UpsertPostInput
): Promise<Post>;
```

- [ ] **Step 1: Write entity admin tests**

Assert create calls:

```ts
expect(from).toHaveBeenCalledWith('posts');
expect(insert).toHaveBeenCalledWith(input);
expect(select).toHaveBeenCalledWith('*');
expect(single).toHaveBeenCalled();
```

Expected initial result: FAIL because admin helpers do not exist.

- [ ] **Step 2: Implement admin helpers**

Use Supabase `insert(...).select('*').single()` and `update(...).eq('id', id).select('*').single()`.

Expected: Supabase errors throw.

- [ ] **Step 3: Write Route Handler auth tests**

For `POST /api/admin/posts`, assert:

```ts
expect(response.status).toBe(401);
```

when `x-admin-post-token` is missing.

For valid token, mock `createAdminPost` and assert `201`.

- [ ] **Step 4: Implement create route**

Route handler flow:

```ts
const token = request.headers.get('x-admin-post-token');
if (!verifyAdminPostToken(token, env.adminPostToken)) {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
const input = await request.json();
const post = await createAdminPost(client, input);
return NextResponse.json({ post }, { status: 201 });
```

Expected: no write happens before token verification.

- [ ] **Step 5: Implement update route**

Same auth flow, then:

```ts
const { id } = await context.params;
const post = await updateAdminPost(client, id, input);
return NextResponse.json({ post });
```

- [ ] **Step 6: Verify**

Run:

```bash
npx vitest run src/entities/post/api/adminPosts.test.ts app/api/admin/posts/route.test.ts app/api/admin/posts/[id]/route.test.ts
npm run type-check
```

Expected: tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/entities/post app/api/admin/posts
git commit -m "feat(admin): add post write APIs"
```

---

### Task 10: Add Admin Editor UI

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `app/admin/posts/page.tsx`
- Create: `app/admin/posts/new/page.tsx`
- Create: `app/admin/posts/[id]/page.tsx`
- Create: `src/pages/admin-posts/index.ts`
- Create: `src/pages/admin-posts/ui/AdminPostsPage/AdminPostsPage.tsx`
- Create: `src/pages/admin-posts/ui/AdminPostsPage/AdminPostsPage.test.tsx`
- Create: `src/pages/admin-posts/ui/AdminPostEditorPage/AdminPostEditorPage.tsx`
- Create: `src/pages/admin-posts/ui/AdminPostEditorPage/AdminPostEditorPage.test.tsx`
- Create: `src/features/post-editor/index.ts`
- Create: `src/features/post-editor/model/usePostEditor.ts`
- Create: `src/features/post-editor/model/usePostEditor.test.ts`
- Create: `src/features/post-editor/ui/PostEditorForm/PostEditorForm.tsx`
- Create: `src/features/post-editor/ui/PostEditorForm/PostEditorForm.css.ts`
- Create: `src/features/post-editor/ui/PostEditorForm/PostEditorForm.test.tsx`

**Interfaces:**
- Produces:

```ts
export type PostEditorValue = UpsertPostInput;

export type PostEditorFormProps = {
  initialValue: PostEditorValue;
  mode: 'create' | 'edit';
  postId?: string;
};
```

- [ ] **Step 1: Install editor dependencies**

Run:

```bash
npm install @uiw/react-codemirror @codemirror/lang-markdown
```

Expected: package files update.

- [ ] **Step 2: Write editor state tests**

Test `usePostEditor` or pure reducer helper:

```ts
expect(buildPostPayload(value)).toEqual({
  ...value,
  tags: ['Next.js', 'RSC'],
  series: null,
});
```

Expected initial result: FAIL because helper does not exist.

- [ ] **Step 3: Implement payload helper**

Keep payload creation in `features/post-editor/model`:

```ts
export const normalizeTags = (raw: string) => {
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};
```

Expected: UI form does not duplicate tag parsing.

- [ ] **Step 4: Write form render test**

Assert visible controls:

```tsx
expect(screen.getByLabelText('제목')).toBeInTheDocument();
expect(screen.getByLabelText('Slug')).toBeInTheDocument();
expect(screen.getByLabelText('본문')).toBeInTheDocument();
expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
```

Expected initial result: FAIL because form does not exist.

- [ ] **Step 5: Implement PostEditorForm**

Use controlled inputs for metadata and `@uiw/react-codemirror` for Markdown content. Include:

```tsx
<CodeMirror
  value={value.content_markdown}
  extensions={[markdown()]}
  onChange={(nextValue) => updateField('content_markdown', nextValue)}
/>
```

Expected: CodeMirror is isolated inside client component.

- [ ] **Step 6: Add preview**

Render:

```tsx
<PostMarkdown source={value.content_markdown} />
```

Expected: preview uses the same renderer as public detail.

- [ ] **Step 7: Add admin pages**

`app/admin/posts/*` re-export from `@/pages/admin-posts`.

Expected: route shells stay thin.

- [ ] **Step 8: Verify**

Run:

```bash
npx vitest run src/features/post-editor src/pages/admin-posts
npm run fsd
npm run type-check
```

Expected: tests, FSD, type-check pass.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json app/admin src/pages/admin-posts src/features/post-editor
git commit -m "feat(admin): add Markdown post editor"
```

---

### Task 11: Add Image Upload API and Editor Insertion

**Files:**
- Create: `app/api/admin/images/route.ts`
- Create: `app/api/admin/images/route.test.ts`
- Create: `src/features/post-editor/api/uploadPostImage.ts`
- Create: `src/features/post-editor/api/uploadPostImage.test.ts`
- Modify: `src/features/post-editor/ui/PostEditorForm/PostEditorForm.tsx`
- Modify: `src/features/post-editor/ui/PostEditorForm/PostEditorForm.test.tsx`

**Interfaces:**
- Produces:

```ts
export type UploadPostImageResponse = {
  url: string;
  path: string;
};

export const uploadPostImage = async (
  file: File,
  token: string
): Promise<UploadPostImageResponse>;
```

- [ ] **Step 1: Write upload route auth tests**

Assert missing token returns 401 and no storage upload is called.

Expected initial result: FAIL because route does not exist.

- [ ] **Step 2: Implement upload route**

Route flow:

```ts
const formData = await request.formData();
const file = formData.get('file');
const path = `posts/${crypto.randomUUID()}-${file.name}`;
await client.storage.from(env.postImageBucket).upload(path, file);
const { data } = client.storage.from(env.postImageBucket).getPublicUrl(path);
return NextResponse.json({ url: data.publicUrl, path }, { status: 201 });
```

Expected: route validates token before reading/uploading file.

- [ ] **Step 3: Write client upload tests**

Mock `fetch` and assert:

```ts
expect(fetch).toHaveBeenCalledWith('/api/admin/images', {
  method: 'POST',
  headers: { 'x-admin-post-token': 'secret' },
  body: expect.any(FormData),
});
```

- [ ] **Step 4: Implement client upload helper**

Throw on non-2xx response and return `{ url, path }`.

- [ ] **Step 5: Insert Markdown image**

After upload, insert:

```md
![image](https://...)
```

into `content_markdown`.

Expected: uploaded image appears in preview.

- [ ] **Step 6: Verify**

Run:

```bash
npx vitest run app/api/admin/images/route.test.ts src/features/post-editor
npm run type-check
```

Expected: tests pass.

- [ ] **Step 7: Commit**

```bash
git add app/api/admin/images src/features/post-editor
git commit -m "feat(admin): upload post images"
```

---

### Task 12: Run Import and End-to-End Verification

**Files:**
- Modify as needed only if verification reveals defects in prior task files.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: imported posts in local and remote Supabase.

- [ ] **Step 1: Apply remote schema**

Run:

```bash
supabase db push --dry-run
supabase db push
```

Expected: only committed pending migrations are applied.

- [ ] **Step 2: Import local**

Set `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_TARGET=local
```

Run:

```bash
npm run blog:import -- --target=local --dry-run
npm run blog:import -- --target=local
```

Expected: 28 posts imported or updated.

- [ ] **Step 3: Verify local build**

Run:

```bash
npm run build
```

Expected: `/blog` and `/blog/[slug]` build successfully with imported posts.

- [ ] **Step 4: Import remote**

Set `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_TARGET=remote
```

Run:

```bash
npm run blog:import -- --target=remote --dry-run
npm run blog:import -- --target=remote
```

Expected: 28 posts imported or updated in remote.

- [ ] **Step 5: Verify remote build**

Run:

```bash
npm run ci
```

Expected: FSD, lint, type-check, test, and build all pass.

- [ ] **Step 6: Manual browser smoke**

Run:

```bash
npm run dev
```

Check:

```txt
/blog
/blog?q=Next
/blog?category=frontend
/blog/[known-slug]
/admin/posts
/admin/posts/new
```

Expected: public pages render; admin API rejects missing token; editor saves when valid token is entered.

- [ ] **Step 7: Commit final fixes**

If any verification fixes were required:

```bash
git add <changed-files>
git commit -m "fix(blog): complete phase 1 verification"
```

---

## Self-Review Checklist

- Spec coverage: Tasks cover schema, env, public search, Markdown renderer, SEO, import, admin editor, image upload, and local/remote verification.
- Scope exclusions preserved: no delete, no Supabase Auth, no arbitrary MDX execution, no normalized tag tables.
- Type consistency: `PostSearchParams`, `UpsertPostInput`, `PostEditorValue`, and `UploadPostImageResponse` are introduced before consumers use them.
- FSD consistency: route shells live in `app`, screen composition in `src/pages`, user workflows in `src/features`, post domain logic in `src/entities/post`, generic config/API in `src/shared`.
- Verification: each task has a targeted test command and commit boundary.
