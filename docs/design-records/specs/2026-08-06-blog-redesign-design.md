# 블로그 개편 설계

작성일: 2026-08-06 (같은 날 개정 — 12절 참고)

> **본문 2~11절은 첫 설계 시점의 기록이다.** 구현 중 초안 개념을 걷어내기로 하면서 어드민 구조가 바뀌었고, 그 변경은 12절에 모았다. 충돌하면 12절이 이긴다.

## 1. 배경과 목표

`posts` 테이블·RLS·Route Handler·통합 테스트는 살아 있는데 **화면이 없다.** [블로그 플랫폼 1차 설계](2026-07-09-blog-platform-phase-1-design.md)가 세운 서버 계층 위에 [디자인 시스템 철거](2026-07-29-design-system-teardown-design.md)가 UI 를 걷어낸 상태다. `/blog` 는 "준비 중" 한 장이고 `/blog/[slug]` 는 아예 없으며, `proxy.ts` 가 `/admin/login` 으로 보내는데 그 페이지가 없어 `/admin/*` 은 무한 404 다.

이 개편은 **공개 읽기 화면과 어드민 쓰기 화면을 세워 글이 흐르게 한다.** 저장소·조회 함수·인증 경계는 그대로 쓰고, 새로 만드는 것은 Markdown 렌더 파이프라인과 화면이다.

### 성공 기준

- `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build` 통과
- `/blog` 에 published 글만 최신 발행일 순으로 보이고, 태그·검색·시리즈로 걸러진다
- 필터 상태가 URL 에 남아 새로고침·공유·뒤로가기가 성립한다
- `/blog/[slug]` 가 본문을 렌더하고, 코드 블록에 색이 있고, 목차 링크가 해당 절로 이동한다
- 시리즈 글에서 앞뒤 화로, 단발 글에서 시간순 앞뒤 글로 넘어간다
- draft slug 로 직접 접근하면 404 다
- 어드민에서 로그인 → 작성 → 발행하면 `/blog` 와 `/blog/[slug]` 에 재배포 없이 반영된다
- 375 / 768 / 1440px 에서 가로 오버플로가 없다

## 2. 확정된 선택

| 선택지 | 결정 | 근거 |
| --- | --- | --- |
| 콘텐츠 소스 | Supabase DB 유지 | 테이블·RLS·admin API·통합 테스트가 이미 완성돼 버릴 코드가 없다. MDX 전환은 그 전부를 폐기한다 |
| Markdown → HTML | 읽기 시 렌더 (react-markdown) | 스키마를 안 건드리고 Markdown 이 유일한 원본으로 남는다. 렌더 규칙을 바꾸면 코드만 고쳐 전인에 즉시 적용된다 |
| 렌더링 시점 | 정적 생성 + 발행 시 재검증 | 방문 요청이 DB 를 안 건드린다. 무료 티어에서 요청당 왕복은 응답 시간과 사용량을 동시에 먹는다 |
| 데이터 경로 | 페이지가 Supabase 를 직접 조회 | 빌드 시점엔 자기 서버가 안 떠 있어 `/api/posts` 왕복이 성립하지 않는다. `createSupabaseStaticClient` 가 이미 그 자리다 |
| 목록 기능 | 태그 · 검색 · 시리즈 | 셋 다 컬럼과 인덱스가 이미 있다. 정적 생성이라 거르는 일은 브라우저가 한다 |
| 검색 범위 | 제목 · 설명 · 태그 | 본문까지 넣으려면 전 글의 `content_markdown` 을 목록에 실어야 해 페이로드가 글 수에 비례해 부푼다 |
| 상세 기능 | 코드 하이라이팅 · 목차 · 앞뒤 내비 | 앞뒤 내비는 목록 데이터로 계산해 추가 조회가 0이다 |
| 서피스 | 라이트 고정 | 글 공간을 밝게 뒤집어 홈과 대비를 만든다. 코드 테마도 한 벌만 맞추면 된다 |
| 어드민 범위 | 에디터 · 미리보기 · 업로드 · 삭제 | 글 목록은 `/blog` 가 겸한다 — 관리용 목록을 따로 두지 않는다 |
| 초안 | 없다 | 저장하면 곧 공개다. `status` 컬럼과 enum 을 스키마에서 제거했다 |
| 어드민 진입 | `/blog` 에서 로그인 상태일 때만 보이는 버튼 | 관리 전용 화면을 따로 오가지 않는다 |
| 부가 | 글별 메타데이터 · sitemap 글 URL · `/api/posts` 존치 | RSS 는 범위 밖 |

## 3. 데이터 흐름

```
빌드 · 재검증 시점
  createSupabaseStaticClient()  →  getPublishedPosts / getPublishedPostBySlug / getPublishedPostSlugs
      ↓
  /blog · /blog/[slug] · /sitemap.xml  (정적 HTML)

어드민 저장 시점
  브라우저 → /api/admin/posts(POST·PUT·DELETE) → RLS → revalidatePath
```

**`revalidateTag` 가 아니라 `revalidatePath` 다.** 페이지가 Supabase SDK 로 직접 조회하면 Next 의 `fetch` 캐시를 타지 않아 `next: { tags }` 를 붙일 자리가 없다. 태그는 `fetch` 를 감싼 캐시에만 걸린다. 지금 `publicPosts.ts` 가 달고 있는 `tags: ['posts']` 는 그 fetcher 와 함께 사라진다.

재검증 대상은 세 곳이다 — `/blog`, `/blog/{slug}`, `/sitemap.xml`. 목록과 sitemap 은 글이 하나만 바뀌어도 내용이 달라진다.

## 4. 의존성

```
react-markdown       Markdown → React 엘리먼트
remark-gfm           표 · 취소선 · 자동 링크
rehype-slug          제목에 id 부여
@shikijs/rehype      코드 하이라이팅 (shiki 동봉)
github-slugger       목차 슬러그를 rehype-slug 와 일치시킨다
```

전부 `dependencies` 다. 서버 렌더 경로에서 실행되므로 `devDependencies` 가 아니다.

**`@shikijs/rehype` 는 동기 하이라이터로 써야 한다.** react-markdown 은 unified 파이프라인을 동기로 돌려 async 플러그인을 받지 못한다. `@shikijs/rehype/core` 의 `rehypeShikiFromHighlighter` 에 `createHighlighterCoreSync` 로 만든 하이라이터를 넘긴다. 언어와 테마는 명시적으로 import 해 번들에 들어갈 것만 넣는다. **설치 시점에 이 API 가 실제로 존재하는지 눈으로 확인한다** — 없으면 거기서 멈추고 파이프라인 형태를 다시 논의한다.

## 5. 파일 구조

### 5.1 신규 — 공개

| 경로 | 책임 |
| --- | --- |
| `app/blog/[slug]/page.tsx` | 라우트 껍데기 + `generateStaticParams` + `generateMetadata` |
| `src/pages/blog-post/ui/BlogPostPage.tsx` | 상세 조립. 본문 · 목차 · 앞뒤 내비 |
| `src/pages/blog-post/ui/PostToc/PostToc.tsx` | 목차 |
| `src/pages/blog-post/ui/PostNav/PostNav.tsx` | 시리즈 · 시간순 앞뒤 |
| `src/pages/blog/ui/PostBrowser/PostBrowser.tsx` | `'use client'` — 필터 조작과 목록을 함께 그린다 |
| `src/pages/blog/lib/useUrlFilters.ts` | URL 쿼리를 필터 상태의 출처로 구독한다 |
| `src/pages/blog/ui/PostCard/PostCard.tsx` | 목록 한 건 |
| `entities/post/ui/PostContent.tsx` | Markdown 렌더. **서버 전용** |
| `entities/post/lib/markdownPlugins.ts` | remark · rehype 플러그인 한 벌 |
| `entities/post/lib/filterPosts.ts` | 목록을 검색어 · 태그 · 시리즈로 거른다 |
| `entities/post/lib/extractHeadings.ts` | 본문에서 목차 항목을 뽑는다 |
| `entities/post/lib/pickAdjacentPosts.ts` | 시리즈 · 시간순 앞뒤 글을 고른다 |
| `src/shared/styles/prose.css` | `@utility prose-post` — 본문 조판 |

`filterPosts` · `extractHeadings` · `pickAdjacentPosts` 는 `pages` 가 아니라 `entities/post/lib` 에 둔다. 셋 다 post 도메인 규칙이고 소비자가 목록·상세·어드민으로 갈린다.

### 5.2 신규 — 어드민

| 경로 | 책임 |
| --- | --- |
| `app/admin/login/page.tsx` | 로그인 라우트 |
| `app/admin/(protected)/layout.tsx` | 서버측 인가 집행 |
| `app/admin/(protected)/posts/page.tsx` · `new/page.tsx` · `[id]/page.tsx` | 목록 · 신규 · 수정 |
| `src/pages/admin-login/ui/AdminLoginPage.tsx` | 로그인 폼 |
| `src/pages/admin-posts/ui/AdminPostsPage.tsx` | 초안 · 발행 목록 |
| `src/pages/admin-post-editor/ui/AdminPostEditorPage.tsx` | 작성 · 수정 겸용 |
| `src/pages/admin-post-editor/ui/MarkdownPreview/MarkdownPreview.tsx` | `'use client'` — 라이브 미리보기 |
| `src/features/manage-post/api/savePost.ts` · `deletePost.ts` · `uploadPostImage.ts` | Route Handler 호출 |
| `src/features/manage-post/model/usePostEditor.ts` | 폼 상태 |

**신규와 수정이 한 슬라이스다.** "라우트 하나에 슬라이스 하나" 원칙의 예외로 둔다 — 두 라우트의 차이는 초기값과 저장 대상뿐이고, 나누면 같은 폼이 두 벌 생겨 필드를 추가할 때마다 양쪽을 고쳐야 한다.

`(protected)` 는 route group 이라 URL 에 나타나지 않는다. `proxy.ts` 가 이미 아는 `/admin/login` · `/admin/posts` 가 그대로 유지된다.

### 5.3 수정

| 대상 | 변화 |
| --- | --- |
| `app/sitemap.ts` | async 로 바꿔 글 URL 을 붙인다 |
| `app/robots.ts` | `/admin` 을 disallow 한다 |
| `app/api/admin/posts/route.ts` · `[id]/route.ts` | `revalidatePath` 배선, DELETE 추가 |
| `src/entities/post/api/adminPosts.ts` | `deleteAdminPost` 추가 |
| `src/shared/styles/global.css` | `prose.css` import |
| `src/pages/blog/ui/BlogPage.tsx` | 플레이스홀더 → 실제 목록 |

### 5.4 삭제

`src/entities/post/api/publicPosts.ts` 와 그 export. 페이지가 Supabase 를 직접 읽으면 소비자가 0이 된다. `/api/posts` Route Handler 자체는 외부 공개 API 로 남긴다.

## 6. 공개 목록 — `/blog`

서버 컴포넌트가 `getPublishedPosts` 로 전체 목록을 읽어 `PostBrowser` 에 넘긴다. 걸러내는 일은 브라우저가 한다.

**필터 상태는 URL 쿼리에 산다** (`?q=` · `?tag=` · `?series=`). 태그 링크를 공유·북마크할 수 있고 뒤로가기가 기대대로 동작한다.

**읽는 수단은 `useSearchParams` 가 아니라 `useSyncExternalStore` 다.** `useSearchParams` 를 쓰면 Next 가 그 서브트리의 정적 프리렌더를 포기해, **글 목록이 정적 HTML 에서 통째로 빠지고 크롤러가 목록을 못 본다.** 서버 스냅샷을 빈 조건으로 두면 정적 결과물에는 전체 목록이 남고, 하이드레이션 뒤 실제 URL 조건이 적용된다. 쓰기는 `history.replaceState` 로 한다 — router 를 거치면 키 입력마다 정적 페이지를 다시 받아온다.

그 대가로 `/blog?tag=X` 로 직접 들어오면 **한 프레임 동안 전체 목록이 보였다가 걸러진다.** 크롤러가 보는 것과 맞바꾼 값이다.

`filterPosts(posts, params)` 는 순수 함수다. 세 조건은 AND 로 겹치고, 검색어는 제목·설명·태그를 대소문자 구분 없이 부분 일치로 본다.

시리즈는 목록 상단에서 묶음으로 보여준다. `series` 가 같은 글을 모으고, `null` 인 글은 묶지 않는다.

## 7. 공개 상세 — `/blog/[slug]`

`generateStaticParams` 가 `getPublishedPostSlugs` 로 경로를 미리 만든다. `dynamicParams` 는 기본값(true) 그대로 둔다 — 빌드 뒤 발행된 글도 첫 요청에 생성되고, draft 는 RLS 가 막아 404 로 떨어진다.

### 7.1 본문 조판

`prose-post` 유틸리티 하나가 태그 기준으로 조판한다. react-markdown 의 `components` 매핑으로 태그마다 클래스를 주지 않는다 — 매핑이 20줄 넘게 늘어나고, 표·인용처럼 우리가 쓸지 미리 모르는 태그가 누락된 채 남는다.

값은 기존 토큰에서 가져온다. 본문은 `--text-body-lg`, 제목은 `--text-statement` 계열, 색은 `--color-foreground` · `--color-muted` · `--color-accent` 다. 새 토큰을 만들지 않는다.

### 7.2 목차

`extractHeadings(markdown)` 이 `##` · `###` 을 뽑아 `{ depth, text, id }` 배열을 만든다. **id 는 `github-slugger` 로 만든다** — `rehype-slug` 가 같은 라이브러리를 쓰므로 이렇게 해야 앵커가 맞는다. 직접 정규화하면 한글·기호·중복 제목에서 조용히 어긋난다.

코드 펜스 안의 `#` 주석을 제목으로 오인하지 않도록 펜스 안쪽은 건너뛴다.

데스크톱에서는 본문 옆에 붙이고, `lg` 미만에서는 본문 위에 접힌 형태로 둔다.

### 7.3 앞뒤 내비

`pickAdjacentPosts(posts, current)` 가 두 가지를 돌려준다.

- 현재 글에 `series` 가 있으면 **같은 시리즈 안에서** 발행일 순 앞뒤
- 없으면 전체 목록에서 발행일 순 앞뒤

상세 페이지도 전체 목록을 읽어야 하지만 빌드 시점이라 요청 비용이 없다.

## 8. 어드민

### 8.1 인가 세 겹

| 층 | 역할 | 성격 |
| --- | --- | --- |
| `proxy.ts` | 비로그인을 `/admin/login` 으로 | optimistic — UX 용 |
| `(protected)/layout.tsx` | 서버에서 세션·role 재확인 | 화면 접근 집행 |
| `requireAdmin` + RLS | 쓰기 요청 검증 | 데이터 집행 |

proxy 는 이미 있고 `requireAdmin` 도 있다. **layout 만 새로 만든다.** proxy 만 믿으면 matcher 를 벗어난 경로가 생겼을 때 조용히 열린다.

`robots.ts` 는 지금 `/` 전체를 allow 한다. 어드민 경로가 생기므로 `/admin` 을 disallow 로 내린다 — 색인은 접근 제어가 아니지만, 로그인 화면이 검색 결과에 뜰 이유가 없다.

### 8.2 에디터

Markdown 입력창과 미리보기를 좌우로 둔다. 저장은 `/api/admin/posts`(신규) 또는 `/api/admin/posts/[id]`(수정) 로 보낸다.

**미리보기는 클라이언트에서 렌더한다.** 입력이 실시간으로 바뀌므로 서버 컴포넌트인 `PostContent` 를 쓸 수 없다. 대신 플러그인 구성을 `markdownPlugins.ts` 한 곳에서 공유해 두 경로가 같은 규칙으로 돈다.

그 대가로 **어드민 라우트에만 shiki 가 클라이언트 번들에 실린다.** 공개 상세는 서버 렌더라 JS 를 싣지 않는다. 미리보기를 공개 경로와 같은 컴포넌트로 통일하면 `'use client'` 가 필요해져 공개 페이지까지 shiki 를 지고 가야 한다 — 읽기 우선이라는 이번 개편의 전제와 맞바꿀 수 없다.

이미지는 `/api/admin/images` 에 올리고 돌아온 public URL 을 입력창 커서 위치에 Markdown 이미지 문법으로 넣는다.

### 8.3 삭제

`DELETE /api/admin/posts/[id]` 를 새로 만든다. 삭제는 되돌릴 수 없으므로 확인 단계를 거친다.

## 9. 테스트

| 대상 | 방법 |
| --- | --- |
| `filterPosts` | 순수 함수 — 조건 조합 · 대소문자 · 빈 조건 |
| `extractHeadings` | 순수 함수 — 깊이 · 슬러그 일치 · 코드 펜스 무시 |
| `pickAdjacentPosts` | 순수 함수 — 시리즈 안/밖 · 양 끝 경계 |
| `PostContent` | 마크다운이 시맨틱 태그로 나오는지, 제목에 id 가 붙는지 |
| `PostBrowser` | 필터 입력이 목록을 줄이는지 (통합) |
| `AdminPostEditorPage` | 저장 호출 payload 계약 |
| DELETE 라우트 | 가드 통과/거부, 에러 매핑 |

계약이 있는 곳에만 둔다. 조판 CSS · 레이아웃 · 하이라이팅 색은 테스트하지 않는다 — 라이브러리가 보장하거나 사람이 눈으로 볼 일이다.

## 10. 범위 밖

- RSS 피드
- 댓글 · 조회수 · 좋아요
- 본문 전문 검색 (제목·설명·태그로 제한)
- 발행 전 초안의 공개 레이아웃 미리보기 — 에디터 미리보기가 대신한다
- 홈 화면 · GSAP 모션 (이번 작업이 건드리지 않는다)

## 11. 알려진 함정

- **react-markdown 은 동기 파이프라인이다.** async rehype 플러그인을 넘기면 런타임에 터진다. shiki 는 동기 하이라이터로 넘긴다(4절).
- **빌드가 Supabase 에 의존한다.** 무료 티어 프로젝트가 장기 미사용으로 일시정지되면 배포 빌드가 깨진다. 지금 막을 수단은 없고, 증상이 "빌드만 실패"로 나타난다는 것을 알아둔다.
- **본문 이미지는 `next/image` 를 타지 않는다.** Markdown 이 만드는 `<img>` 는 Storage 원본을 그대로 부른다. 업로드 시 5MiB 제한이 유일한 방어선이다.
- **목차 슬러그는 `rehype-slug` 와 같은 구현을 써야 맞는다**(7.2절). 직접 만들면 한글·중복 제목에서 어긋나고, 링크만 조용히 죽는다.
- **`useSearchParams` 를 목록에 쓰면 안 된다**(6절). Suspense 경계를 둬도 그 서브트리는 정적 HTML 에서 빠져, 빌드는 통과하는데 크롤러만 목록을 못 보는 상태가 조용히 남는다.
- **목록 필터 상태는 setState 가 아니라 URL 구독이다.** effect 안에서 초기 조건을 setState 하면 React Compiler 린트(`react-hooks/set-state-in-effect`)에 걸린다.
- **jsdom 은 테스트 파일 안에서 `location` 을 공유한다.** 필터가 URL 을 쓰므로, 앞 케이스가 남긴 쿼리가 다음 마운트의 초기 조건으로 샌다. 케이스마다 URL 을 되돌린다.
- **`revalidateTag` 가 아니라 `revalidatePath` 다**(3절). SDK 직접 조회는 fetch 캐시를 안 탄다.
- **미리보기와 공개 렌더는 다른 컴포넌트다**(8.2절). 플러그인은 공유하지만 실행 환경이 갈리므로, 렌더 규칙을 바꿀 때 양쪽이 같은 모듈을 보는지 확인한다.
- **`proxy.ts` 는 optimistic 이다.** 인가의 최종 집행자는 layout 과 RLS 다(8.1절).
- **`PostContent`·`markdownPlugins` 를 `entities/post` 배럴에 넣으면 안 된다.** 하이라이터를 모듈 최상위에서 만들어 부수효과가 있으므로, 클라이언트 컴포넌트가 배럴에서 `filterPosts` 하나만 가져와도 shiki 380KB 가 딸려 들고 트리셰이킹으로 안 걷힌다. 실제로 한 번 새어 `/blog` 클라이언트 청크가 900KB 더 무거웠다.
- **`features/manage-post` 는 `@/shared/api` 배럴을 못 쓴다.** 배럴이 `next/headers` 를 쓰는 server client 를 끌어와 빌드가 깨진다. `@/shared/api/http/client` 를 직접 가져온다(`features/auth` 와 같은 예외).
- **page 의 default export 는 `params`·`searchParams` 밖의 prop 을 못 받는다.** 초기값을 넘겨야 하는 편집 화면은 re-export 대신 라우트에서 감싼다.
- **삭제에는 별도 RLS 정책이 필요하다.** `grant delete` 와 `for delete` 정책이 없으면 가드를 통과하고도 42501 로 막힌다. `20260806000000_posts_admin_delete_policy.sql` 을 원격에 push 해야 실제로 지워진다.

## 12. 개정 — 초안 개념 제거 (같은 날)

첫 설계는 `draft`/`published` 를 다루는 어드민 목록을 뒀다. 그 초안 개념은 **2026-06-19 스키마에서 온 것**이지 이번에 요구된 것이 아니었고, 실제로는 "관리자만 글을 올린다" 외의 요구가 없었다. 구현 도중 이를 확인하고 걷어냈다.

### 12.1 바뀐 결정

| 항목 | 첫 설계 | 개정 |
| --- | --- | --- |
| 초안 | `status` 로 draft/published 구분 | **없다.** 저장하면 곧 공개다 |
| `status` 컬럼 | 유지 | `post_status` enum 과 함께 **삭제** |
| 공개 읽기 RLS | `using (status = 'published')` | `using (true)` — 숨길 대상이 없다 |
| `published_at` | nullable | **NOT NULL**, 기본값 `now()` |
| 어드민 목록 화면 | `/admin/posts` | **없앤다.** `/blog` 가 겸한다 |
| 어드민 진입 | 전용 화면을 오간다 | `/blog` 와 `/blog/[slug]` 에서 로그인 상태일 때만 버튼이 보인다 |
| 삭제 자리 | 에디터 | **글 상세**에만 (되돌릴 수 없는 동작의 자리를 하나로) |
| 로그인 후 목적지 | `/admin/posts` | `/blog` |

조회 함수 이름에서도 `Published` 를 뺐다 — `getPosts` · `getPostSlugs` · `getPostBySlug`. 걸러낼 상태가 없는데 이름만 필터를 암시하면 거짓말이 된다.

### 12.2 로그인 상태에 따라 버튼을 보이면서 정적을 지키는 법

`/blog` 와 `/blog/[slug]` 는 정적 생성이다. 로그인 여부로 화면이 갈리면 정적이 깨질 수 있어, **버튼만 클라이언트 컴포넌트로 뺀다.**

`useIsAdmin()` 은 첫 렌더에서 **항상 false** 를 돌려주고, 마운트 뒤 브라우저 세션을 확인해 갱신한다. 그래서 정적 HTML 한 벌에는 운영자 UI 가 섞이지 않고, 크롤러가 받는 결과물도 로그인 여부와 무관하게 같다.

**버튼을 감추는 것은 인가가 아니다.** 남이 억지로 버튼을 띄워도 저장·삭제는 `requireAdmin` 과 RLS 가 거부한다. 감춤은 편의일 뿐이다.

### 12.3 마이그레이션

`20260806010000_drop_post_status.sql` — 정책 교체 → 인덱스·컬럼·enum 삭제 → `published_at` 백필 후 NOT NULL.

**원격에 push 하기 전까지 새 글이 조용히 초안으로 저장된다.** 코드는 `status` 를 더 이상 보내지 않는데 DB 기본값이 `'draft'` 라, 저장은 성공하지만 공개 조회 정책이 그 행을 가린다. 증상이 "저장했는데 목록에 없다" 로 나타난다.

### 12.4 이 개정에서 드러난 것

**선택지에 요구되지 않은 기능을 끼워 팔지 말 것.** 어드민 범위를 물을 때 "목록 + 에디터 + 미리보기" 를 한 덩어리로 제시하면서 초안 구분을 그 안에 섞었다. 필요 여부를 따로 묻지 않아, 원치 않은 개념이 스키마·화면·테스트까지 퍼진 뒤에야 걸러졌다.
