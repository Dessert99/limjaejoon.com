# Blog Platform Phase 1 Design

## 2026-07-09 Taxonomy Revision

Phase 1 구현 후 taxonomy 방향을 tag-first로 조정한다.

- `category`는 `tags`와 의미가 겹치므로 운영 모델에서 제거한다.
- `posts.category` 컬럼과 category 필터/index는 후속 migration으로 drop한다.
- `tags`는 하나 이상 필수인 핵심 검색/분류 메타데이터로 둔다.
- `series` 컬럼은 유지하되, 당장은 모든 import row에 `null`을 넣는다.
- 중첩 태그 검색은 후속 단계에서 별도로 설계한다.

## 목표

기존 `content/blog/*.mdx` 글을 Supabase 기반 공개 블로그로 이식하고, 원격 Supabase 운영 환경에서 검색/분류/SEO/이미지 업로드/브라우저 작성·수정이 가능한 1차 블로그 운영 버전을 만든다.

완료 기준은 다음 문장으로 잡는다.

> 기존 MDX 글을 Supabase로 이식하고, 원격 Supabase 기반으로 검색/SEO/이미지 포함 블로그를 운영하며, 브라우저에서 새 글 작성과 수정까지 가능한 상태.

## 범위

포함한다.

- Supabase `posts` schema 확장: `category`, `series`, 검색/필터 인덱스.
- 공개 읽기 권한과 RLS: published 글만 공개 조회.
- local/remote env target: `NEXT_PUBLIC_SUPABASE_TARGET=local | remote`.
- `content/blog/*.mdx` 28개 글을 Supabase `posts`로 이식하는 스크립트.
- 기존 MDX 파일은 검증용 archive로 보존.
- 공개 `/blog` 목록: Supabase 쿼리 기반 `q`, `category`, `series`, `tag` 필터.
- 공개 `/blog/[slug]` 상세: Markdown 렌더링, 코드 하이라이트, heading anchor, SEO metadata.
- sitemap/robots/metadata: published 글만 노출.
- admin editor 1차: 새 글 작성, 기존 글 수정, draft/published 전환.
- CodeMirror 6 기반 Markdown editor와 preview.
- Supabase Storage 이미지 업로드 후 Markdown 이미지 문법 삽입.
- `ADMIN_POST_TOKEN` 기반 admin API 보호.

제외한다.

- 삭제 기능.
- 댓글, 좋아요, 조회수.
- Supabase Auth 로그인.
- 벨로그/티스토리급 완성형 WYSIWYG editor.
- 의사결정 문서 popover 실제 구현.
- 컴포넌트 demo embed 실제 구현.
- 정규화된 `categories`, `tags`, `post_tags` 테이블.
- CI에서 자동 `supabase db push`.

## 데이터 모델

1차에서는 `posts` 단일 테이블을 유지한다. 정규화 테이블은 운영 중 분류량이 실제로 커질 때 도입한다.

`posts`는 기존 필드에 아래 필드를 추가한다.

- `category text not null default 'uncategorized'`
- `series text`

검색/필터는 다음 원칙을 따른다.

- `category`: 큰 주제. 예: `frontend`, `tooling`, `infrastructure`, `career-business`.
- `series`: 연재/묶음. 예: `Next.js App Router`, `React Internals`, `Testing`, `DevOps`.
- `tags`: 세부 키워드. 기존 `text[]` 유지.
- `q`: Supabase query에서 title/description/content_markdown을 대상으로 검색한다.

인덱스는 1차에서 다음을 둔다.

- `status`, `published_at` 조회용 btree index.
- `category`, `series` 필터용 btree index.
- `tags` 필터용 GIN index.
- 본문 검색은 `ILIKE` 또는 trigram 기반 검색으로 시작한다. 실제 글 수가 많아지기 전까지 tsvector 기반 전문 검색은 보류한다.

## 권한 모델

공개 읽기는 anon key를 사용한다.

- `anon`과 `authenticated`에 `SELECT ON public.posts` 권한을 준다.
- RLS policy는 `status = 'published'`인 글만 공개한다.
- `draft` 글은 service role을 쓰는 admin API에서만 조회·수정한다.

쓰기 작업은 브라우저에서 Supabase에 직접 쓰지 않는다.

- 브라우저 admin UI는 Next Route Handler로 요청한다.
- Route Handler는 `ADMIN_POST_TOKEN`을 검증한다.
- 검증이 통과하면 service role client로 insert/update/upload를 수행한다.

admin token 전달 방식은 다음과 같이 고정한다.

- admin 화면에서 token을 입력한다.
- 클라이언트는 token을 `sessionStorage`에 보관한다.
- admin API 요청마다 `x-admin-post-token` header로 보낸다.
- 서버는 `ADMIN_POST_TOKEN`과 상수 시간 비교로 검증한다.

## Supabase 환경 구성

앱은 target 기반으로 Supabase 값을 읽는다.

- `NEXT_PUBLIC_SUPABASE_TARGET=local | remote`
- local 값: `NEXT_PUBLIC_LOCAL_SUPABASE_URL`, `NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY`, `LOCAL_SUPABASE_SERVICE_ROLE_KEY`
- remote 값: `NEXT_PUBLIC_REMOTE_SUPABASE_URL`, `NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY`, `REMOTE_SUPABASE_SERVICE_ROLE_KEY`
- 이미지 bucket: `LOCAL_POST_IMAGE_BUCKET`, `REMOTE_POST_IMAGE_BUCKET`

기존 active env fallback인 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`는 당분간 호환용으로 유지한다.

## MDX 이식 정책

현재 MDX frontmatter는 이식용 원본으로 충분하다.

```md
---
title: '...'
date: '2026-04-02'
description: '...'
tags: ['Next.js', 'RSC']
---
```

MDX 파일 자체에 `category`와 `series`를 대량 추가하지 않는다. 대신 이식 스크립트에서 slug별 보강 metadata를 합친다.

- 원본: `content/blog/*.mdx`
- 보강: `scripts/blog-import/postMetadataOverrides.mjs`
- 실행: `scripts/blog-import/importPosts.mjs`

slug는 파일명에서 확정한다. 예: `content/blog/2026-04-06-next-fetch.mdx` -> `2026-04-06-next-fetch`.

이식은 upsert 방식으로 실행한다. 같은 slug를 다시 이식하면 해당 row를 갱신한다.

## 공개 블로그 구조

Next App Router는 계속 얇은 껍데기로 둔다.

- `app/blog/page.tsx`: `@/pages/blog` re-export와 route metadata.
- `app/blog/[slug]/page.tsx`: `@/pages/blog-post` re-export, `dynamicParams = true`.

FSD 구현 위치는 다음과 같다.

- `src/pages/blog`: URL searchParams 파싱, 공개 목록 화면 조립.
- `src/pages/blog-post`: 상세 데이터 조회, notFound, metadata 생성, 상세 화면 조립.
- `src/features/post-filter`: 검색어/category/series/tag 입력 UI.
- `src/entities/post`: post 타입, Supabase query, Markdown renderer.

목록 필터 URL은 다음 형식을 지원한다.

- `/blog`
- `/blog?q=react`
- `/blog?category=frontend`
- `/blog?series=Next.js%20App%20Router`
- `/blog?tag=Next.js`
- `/blog?category=frontend&tag=Next.js&q=cache`

## Markdown 렌더링

저장 원본은 `content_markdown` 문자열이다.

1차 렌더러는 Markdown 중심으로 간다.

- `react-markdown`
- `remark-gfm`
- 기존 `rehype-slug`
- 기존 `rehype-autolink-headings`
- 기존 `rehype-pretty-code`
- 기존 `shiki`

MDX처럼 임의 React 컴포넌트를 실행하지 않는다. 나중에 `::decision{}` 같은 제한 embed 문법을 추가할 수 있도록 renderer 파일을 독립시킨다.

1차에서 embed를 구현하지는 않는다. renderer 내부 구조만 나중 확장을 막지 않게 둔다.

## Admin Editor

admin route는 다음을 만든다.

- `app/admin/posts/page.tsx`: admin 글 목록과 새 글 진입.
- `app/admin/posts/new/page.tsx`: 새 글 작성.
- `app/admin/posts/[id]/page.tsx`: 기존 글 수정.

FSD 구현 위치는 다음과 같다.

- `src/pages/admin-posts`: admin 목록/작성/수정 page 조립.
- `src/features/post-editor`: CodeMirror editor, preview, 이미지 업로드, 저장 form workflow.
- `src/entities/post`: admin 조회/저장 payload 타입과 server write 함수.
- `src/shared/api/supabase/admin.ts`: service role Supabase client.

editor 라이브러리는 CodeMirror 6를 사용한다.

- React wrapper: `@uiw/react-codemirror`
- Markdown extension: `@codemirror/lang-markdown`
- preview: 공개 상세와 같은 Markdown renderer 재사용.

1차 editor 필드는 다음이다.

- title
- slug
- description
- category
- series
- tags
- status
- published_at
- content_markdown

삭제 기능은 만들지 않는다.

## Admin API

쓰기 API는 `app/api/admin/*`에 둔다.

- `app/api/admin/posts/route.ts`: POST 새 글 생성.
- `app/api/admin/posts/[id]/route.ts`: PATCH 기존 글 수정.
- `app/api/admin/images/route.ts`: POST 이미지 업로드.

Route Handler는 HTTP 경계만 담당한다.

- token 검증.
- request body 파싱.
- entity/service 함수 호출.
- JSON 응답.

Supabase write 로직은 `entities/post/api/adminPosts.ts`로 내린다.

## 이미지 업로드

이미지는 Supabase Storage bucket에 저장한다.

- local bucket: `LOCAL_POST_IMAGE_BUCKET`
- remote bucket: `REMOTE_POST_IMAGE_BUCKET`
- 1차는 public bucket으로 둔다.

업로드 API는 파일을 받아 Storage에 올리고 public URL을 반환한다. editor는 반환된 URL로 아래 Markdown을 삽입한다.

```md
![alt](https://...)
```

## SEO

published 글만 SEO 표면에 노출한다.

- `/blog` metadata: 블로그 목록 설명과 canonical.
- `/blog/[slug]` metadata: title, description, openGraph article, twitter card, canonical.
- `app/sitemap.ts`: 홈, blog, lab, published post URL 포함.
- `app/robots.ts`: sitemap URL 유지.

draft 글은 sitemap과 공개 metadata 생성 대상에서 제외한다.

## 검증 전략

각 task는 TDD로 진행한다. 주요 검증 명령은 다음이다.

- `npm run fsd`
- `npm run lint`
- `npm run type-check`
- `npm run test`
- `npm run build`
- `supabase db push --dry-run`
- `supabase db push`

remote migration은 dry-run 확인 후 push한다.

## 구현 순서

1. 현재 env target과 public read grant groundwork를 확정한다.
2. DB schema를 `category`, `series`, 검색/필터 index까지 확장한다.
3. generated Supabase type과 post app-facing type을 갱신한다.
4. MDX import script를 만든다.
5. 공개 post query를 검색/필터 조건 기반으로 확장한다.
6. 공개 `/blog` 목록 UI를 검색/분류 UI와 함께 재구성한다.
7. Markdown renderer를 분리하고 상세 페이지에 적용한다.
8. sitemap/metadata를 published posts 기반으로 확장한다.
9. admin service role client와 token guard를 만든다.
10. admin posts API를 만든다.
11. admin editor UI를 만든다.
12. 이미지 업로드 API와 editor 삽입 흐름을 만든다.
13. local import -> local build -> remote migration -> remote import -> remote build 순서로 운영 검증한다.
