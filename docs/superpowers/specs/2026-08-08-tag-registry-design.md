# 태그 레지스트리 설계

작성일: 2026-08-08

## 1. 배경과 목표

지금 태그는 `posts.tags text[]` 컬럼 하나에 문자열로 산다. 에디터에서 쉼표로 갈라 자유롭게 치고([toUpsertInput.ts](../../../src/features/manage-post/lib/toUpsertInput.ts)), `/blog` 의 필터 선택지는 전체 글을 훑어 `Set` 으로 모은다([BlogPage.tsx](../../../src/pages/blog/ui/BlogPage.tsx)).

그래서 **태그의 유일한 출처가 "글에 붙은 문자열"이다.** `React` · `react` · `리액트` 가 조용히 다른 태그로 갈라지고, 필터 사이드바에 셋이 나란히 뜬다. 이름을 고치려면 그 태그가 붙은 글을 전부 열어 손으로 고쳐야 하고, 안 쓰는 태그를 정리할 수단도 없다.

이 작업은 **태그를 글과 독립적으로 존재하는 대상으로 승격한다.** 태그는 자기 수명을 갖고, 글은 등록된 태그만 고를 수 있으며, 이름 수정과 삭제가 한자리에서 끝난다.

### 성공 기준

- `npm run fsd && npm run lint && npm run type-check && npm run test && npm run build` 통과
- 에디터에서 태그를 새로 만들고, 이름을 고치고, 지울 수 있다
- 태그 이름을 고치면 그 태그가 붙은 글 전부가 새 이름으로 보인다 — 재배포 없이
- 연결된 글이 있는 태그는 지워지지 않고, 그 사실이 화면에 뜬다
- 글에는 등록된 태그만 붙는다 — 자유 입력이 사라진다
- 마이그레이션 뒤 글별 태그가 이관 전과 같다 — 대소문자만 다르던 표기는 하나로 접힌 뒤 기준(10.1)
- `/blog` 의 검색·태그 필터가 지금과 똑같이 동작한다

## 2. 확정된 선택

| 선택지 | 결정 | 근거 |
| --- | --- | --- |
| 데이터 모델 | `tags` + `post_tags` 조인 | 요구 세 개(삭제 가드·이름 전파·등록된 태그만)가 전부 외래키로 DB 에서 집행된다. 레지스트리만 더하면 셋 다 앱 규약으로 남고 이름 수정은 오히려 RPC 를 부른다 |
| `posts.tags` 컬럼 | 제거 | 두 곳이 같은 사실을 들고 있으면 반드시 어긋난다. 조인이 유일한 출처다 |
| 태그 이름 유일성 | `lower(name)` 기준 | 표기 흔들림을 막는 게 이 작업의 출발점이다. `React` 와 `react` 가 공존하면 아무것도 못 고친 셈이다 |
| 삭제 가드 | FK `on delete restrict` | 앱이 "쓰는 글 있나" 조회 후 지우면 확인과 삭제 사이에 글이 저장될 때 샌다. DB 가 거부하면 그 창이 없다 |
| 글 삭제 시 연결 | `on delete cascade` | 글이 사라지면 연결도 의미가 없다. 태그 자체는 남는다 |
| 태그 이름 정규화 | API 가 `trim`, DB 가 재확인 | `lower(name)` 만으로는 `React` 와 `React ` 가 공존한다. 표기 흔들림을 막는 게 목적인데 공백으로 다시 갈리면 아무것도 못 고친 셈이다 |
| 저장 원자성 | RPC 없이 2단계 + 보상 삭제 | Supabase 는 클라이언트에서 트랜잭션을 못 연다. 신규 글은 연결 삽입이 실패하면 방금 만든 행을 되돌린다 — 그냥 두면 `slug` unique 탓에 재저장이 409 로 막혀 복구 수단 자체가 사라진다(2.2) |
| 관리 화면 | 에디터 안 모달 | 태그를 고치는 순간은 글을 쓰다 태그를 고를 때다. 전용 라우트를 오가면 쓰던 글을 두고 나가야 한다 |
| 글의 태그 입력 | 등록 태그 배지 토글 | `PostBrowser` 가 이미 쓰는 패턴이라 새 의존이 없다 |
| `/blog` 필터 선택지 | 지금처럼 **쓰인 태그만** | 글 0건인 태그를 띄우면 누르는 순간 항상 빈 결과다 |
| `getPosts` 의 `params` | 제거 | 아래 2.1 |

### 2.1 `getPosts(client, params)` 를 걷어내는 이유

[posts.ts](../../../src/entities/post/api/posts.ts) 의 `getPosts` 는 `q` · `tags` 로 서버에서 거르는 인자를 받는데, **부르는 쪽이 하나도 없다.** `BlogPage` · `loadPublishedPosts` · `/api/posts` 셋 다 인자 없이 부르고, 거르는 일은 브라우저의 `filterPosts` 가 한다(정적 생성이라 그게 설계다).

조인으로 바꾸면 `.contains('tags', ...)` 는 컴파일조차 안 되므로 **재작성이 강제된다.** 조인 모델에서 태그 AND 를 한 쿼리로 재현하려면 `group by ... having count(*) = n` 급 서브쿼리나 RPC 가 필요하다. 소비자 0인 코드에 그 복잡도를 들일 이유가 없다.

`PostSearchParams` 타입 자체는 남는다 — `filterPosts` 와 `useUrlFilters` 가 쓰는 브라우저 측 계약이다.

### 2.2 신규 글 저장이 실패했을 때

[adminPosts.ts](../../../src/entities/post/api/adminPosts.ts) 의 `createAdminPost` 는 `.insert()` 고 `posts.slug` 에는 unique 제약이 있다. 그래서 **글은 들어갔는데 `post_tags` 삽입이 실패한 상태를 그냥 두면 재저장이 복구 수단이 되지 못한다** — 같은 slug 로 다시 POST 하면 `23505` 로 막히고, 운영자는 태그 없이 공개된 글과 저장 못 하는 폼 사이에 갇힌다.

그래서 신규 경로에 한해 연결 삽입이 실패하면 **방금 만든 글 행을 지우고** 에러를 올린다. 수정 경로는 `.update()` 라 재시도가 그대로 성립하므로 보상이 필요 없다.

이건 트랜잭션이 아니다. 보상 삭제 자체가 실패하면 여전히 태그 없는 글이 남는다. 그 창까지 닫으려면 RPC 가 필요하고, 거기까지는 가지 않는다.

## 3. 데이터 모델

```
tags
  id          uuid    pk default gen_random_uuid()
  name        text    not null
                check (name = btrim(name) and name <> '')
  created_at  timestamptz not null default now()
  unique index on lower(name)

post_tags
  post_id     uuid    not null references posts(id) on delete cascade
  tag_id      uuid    not null references tags(id)  on delete restrict
  primary key (post_id, tag_id)
  index on (tag_id)
```

`post_tags(tag_id)` 인덱스는 삭제 가드가 매번 타는 경로다. 복합 PK 의 선두는 `post_id` 라 `tag_id` 단독 조회를 못 받쳐준다.

**`lower(name)` unique 만으로는 부족하다.** 그 인덱스는 `React` 와 `react` 를 충돌시키지만 `React` 와 `React ` 는 서로 다른 값으로 통과시키고, `not null` 은 빈 문자열도 막지 않는다. 그래서 API 가 받는 즉시 `trim` 하고, DB 가 `check (name = btrim(name) and name <> '')` 로 재확인한다 — 앞뒤 공백만 다른 태그가 생기면 표기 흔들림을 막겠다는 이 작업의 전제가 무너진다.

`posts.tags` 컬럼과 `posts_tags_idx`(GIN), `posts_tags_not_empty` 체크 제약은 함께 사라진다.

**"글에 태그 최소 1개" 는 앱이 지킨다.** 조인으로 옮기면 그 불변식을 DB 에서 지킬 자리가 트리거밖에 없는데, 트리거는 마이그레이션 중간 상태(글은 들어갔고 연결은 아직)에서 스스로를 막는다. 저장 라우트에서 빈 배열을 400 으로 돌려보낸다.

## 4. 데이터 흐름

```
빌드 · 재검증 시점
  createSupabaseStaticClient()
    → getPosts / getPostBySlug   (posts ⋈ post_tags ⋈ tags)
    → tags: string[] 로 되접어 반환
    → /blog · /blog/[slug] · /sitemap.xml  (정적 HTML)

태그 관리 (에디터 모달)
  브라우저 → /api/admin/tags(GET·POST) · /api/admin/tags/[id](PATCH·DELETE)
    → requireAdmin → RLS → revalidatePublicPosts()

글 저장
  브라우저 → /api/admin/posts(POST) · /api/admin/posts/[id](PATCH)
    → posts upsert → post_tags 재동기화 → revalidatePublicPosts()
```

**재검증은 이름 수정(PATCH)에만 붙는다.** 태그명이 목록·상세·필터 사이드바의 정적 HTML 에 박혀 있어 안 부르면 옛 이름이 남는다.

생성과 삭제는 안 부른다. `/blog` 의 필터 선택지는 글에서 뽑으므로(2절) **글이 0인 태그는 공개 화면에 애초에 안 나온다.** 새 태그는 아직 0이고, 지워지는 태그는 FK 때문에 반드시 0이었다.

## 5. 파일 구조

### 5.1 신규

| 경로 | 책임 |
| --- | --- |
| `supabase/migrations/20260808100000_normalize_post_tags.sql` | 테이블·정책·데이터 이관 |
| `src/entities/tag/model/tag.types.ts` | `Tag` 타입 |
| `src/entities/tag/api/tags.ts` | `getTags` — 공개 읽기 |
| `src/entities/tag/api/adminTags.ts` | `createAdminTag` · `updateAdminTag` · `deleteAdminTag` |
| `src/entities/tag/index.ts` | 공개 API |
| `app/api/admin/tags/route.ts` | GET · POST |
| `app/api/admin/tags/[id]/route.ts` | PATCH · DELETE |
| `src/features/manage-tag/api/*.ts` | Route Handler 호출 4종 |
| `src/features/manage-tag/model/useTagManager.ts` | 모달 상태 |
| `src/features/manage-tag/ui/TagManagerDialog/TagManagerDialog.tsx` | 관리 모달 |
| `src/features/manage-tag/index.ts` | 공개 API |
| `src/pages/admin-post-editor/ui/TagPicker/TagPicker.tsx` | 글의 태그 선택 |
| `src/shared/ui/dialog.tsx` | shadcn `dialog` — 지금은 `alert-dialog` 만 있다 |

### 5.2 수정

| 대상 | 변화 |
| --- | --- |
| `src/entities/post/api/posts.ts` | 조인 select, `tags: string[]` 로 되접기, `params` 제거 |
| `src/entities/post/api/adminPosts.ts` | 저장 후 `post_tags` 재동기화, 반환값에 태그 조립, 신규 실패 시 보상 삭제 |
| `src/entities/post/model/post.types.ts` | `Post` 가 Row 그대로가 아니다 — 6.2 |
| `app/admin/(protected)/posts/[id]/page.tsx` | `select('*')` → 태그 id 까지 읽는 투영 — 6.4 |
| `supabase/seed.sql` | 옛 컬럼 제거 + `post_tags` 채우기 — 10.2 |
| `src/features/manage-post/lib/toUpsertInput.ts` | `PostDraft.tags` 를 `string` → `string[]` |
| `src/features/manage-post/model/usePostEditor.ts` | 위 타입 변경 반영 |
| `src/pages/admin-post-editor/ui/AdminPostEditorPage.tsx` | 쉼표 입력 → `TagPicker` + 관리 버튼 |
| `app/api/admin/_lib/adminGuard.ts` | `mapWriteError` 에 `23503` 매핑 추가 |
| `app/api/admin/posts/route.ts` · `[id]/route.ts` | 빈 태그 400 |
| `src/shared/api/supabase/database.types.ts` | `npm run db:types` 재생성 |
| `src/shared/ui/index.ts` | `dialog` re-export |

`filterPosts` · `PostBrowser` · `PostRow` · `BlogPostPage` · `collectTags` · `useUrlFilters` 는 **손대지 않는다.** 되접기가 `entities/post/api` 안에서 끝나 이들이 보는 `tags: string[]` 계약이 그대로다.

## 6. 공개 읽기 경로

### 6.1 조인 select

PostgREST 는 junction 의 외래키 두 개로 다대다를 추론해 `tags(name)` 축약도 받지만, **junction 을 명시하는 쪽으로 정했다.**

```ts
.select('id, slug, title, description, published_at, post_tags(tags(name))')
```

축약은 추론에 기대므로, 나중에 `post_tags` 에 컬럼이 붙거나 관계가 하나 더 생기면 조용히 다른 걸 고를 수 있다. 한 겹 더 쓰는 값으로 그 모호함을 없앤다.

**되접을 때 `post_tags` 를 벗겨낸다.** 스프레드로 두면 조인 구조가 그대로 남아 `/blog` 의 클라이언트 컴포넌트까지 실려 간다.

### 6.2 `Post` 타입

`Post = Database['public']['Tables']['posts']['Row']` 는 더 이상 성립하지 않는다. Row 에서 `tags` 가 사라지고, 앱이 보는 값은 조인 결과다.

```ts
type PostRow = Database['public']['Tables']['posts']['Row'];
export type Post = PostRow & { tags: string[] };
```

`PostListItem` 은 지금처럼 `Pick` 으로 좁힌다.

### 6.3 태그 순서

**조인 결과의 태그 순서는 보장되지 않는다.** 되접을 때 이름순으로 정렬한다. 안 하면 같은 글의 정적 HTML 이 빌드마다 다른 순서로 나와, 바뀐 게 없는데 diff 가 흔들린다.

### 6.4 `select('*')` 로 posts 를 읽는 자리가 더 있다

공개 fetcher 만 고치면 안 된다. `posts.tags` 컬럼이 사라지는 순간 **raw 행을 그대로 쓰는 세 자리가 함께 깨진다.**

| 자리 | 지금 | 바뀔 것 |
| --- | --- | --- |
| [admin `[id]/page.tsx`](../../../app/admin/(protected)/posts/[id]/page.tsx) | `select('*')` → `toDraft(data)` | `tags(id)` 를 함께 읽는다 — 편집 폼은 이름이 아니라 **id** 가 필요하다(9절) |
| `createAdminPost` | `.insert().select('*')` | 연결 삽입 뒤 태그 이름을 붙여 `Post` 로 조립 |
| `updateAdminPost` | `.update().select('*')` | 위와 같다 |

앞의 둘을 빠뜨리면 타입 검사가 먼저 터지고, 통과시키더라도 기존 글 편집이 태그 없이 열린다.

## 7. 어드민 API

기존 posts 라우트와 같은 골격이다 — `requireAdmin` 으로 Origin·admin 을 재검증하고, 실패는 `mapWriteError` 로 상태에 매핑한다.

| 라우트 | 동작 | 실패 |
| --- | --- | --- |
| `GET /api/admin/tags` | 이름순 전체 + 글 수 | — |
| `POST /api/admin/tags` | 생성 | 중복 이름 409 (`23505`) |
| `PATCH /api/admin/tags/[id]` | 이름 수정 | 중복 이름 409, 없는 id 404 |
| `DELETE /api/admin/tags/[id]` | 삭제 | 연결된 글 있음 409 (`23503`), 없는 id 404 |

**`mapWriteError` 에 `23503`(foreign_key_violation) → 409 를 더한다.** 지금은 이 코드가 500 으로 떨어져, 정상적인 거부가 서버 장애로 보인다.

**모달 목록에는 태그별 글 수가 필요하다.** 지울 수 있는지를 누르기 전에 보여줘야 한다. `tags` 에 `post_tags(count)` 를 붙여 한 번에 읽는다.

## 8. 태그 관리 모달

에디터 태그 입력 옆 "태그 관리" 버튼이 shadcn `Dialog` 를 연다. 모달 안에서:

- **목록** — 이름순, 각 행에 연결된 글 수
- **추가** — 이름 입력 + 확인
- **이름 수정** — 행 안에서 인라인 편집
- **삭제** — 글 수가 0인 행만 활성. 되돌릴 수 없으므로 `AlertDialog` 로 한 겹 더 확인

**모달을 닫으면 부모의 태그 목록이 갱신된다.** 방금 만든 태그를 바로 고를 수 있어야 한다.

**갱신할 때 사라진 태그를 선택 상태에서 걷어낸다.** 아직 저장하지 않은 글에서 글 수 0인 태그를 골라 둔 채 모달에서 그 태그를 지우면, 목록에는 없는데 선택 id 만 남는다. 그대로 저장하면 없는 `tag_id` 로 `23503` 이 나고, 재동기화가 delete-then-insert 라 **멀쩡하던 나머지 연결까지 지워진 뒤 실패한다.**

**이름을 고치면 편집 중인 글의 선택 상태도 따라가야 한다.** 선택을 이름 문자열로 들고 있으면 옛 이름이 남아 저장 때 사라진다. 그래서 **에디터의 선택 상태는 태그 id 로 든다** — 이름은 렌더할 때만 쓴다.

글 수가 0이 아닌 태그의 삭제 버튼은 비활성이지만, **그건 편의일 뿐이다.** 눌러도 FK 가 거부한다.

## 9. 글의 태그 선택

`TagPicker` 가 등록된 태그를 배지로 늘어놓고 토글한다. 선택된 것만 `variant='default'`, 나머지는 `outline` — `PostBrowser` 와 같은 모양이다.

자유 입력은 사라진다. 새 태그가 필요하면 관리 모달에서 만든다.

**`PostDraft.tags` 가 `string`(쉼표 문자열)에서 `string[]`(태그 id)로 바뀐다.** `toUpsertInput` 의 `split(',')` 과 `toDraft` 의 `join(', ')` 이 함께 사라진다.

**저장 payload 의 필드 이름도 `tags` 에서 `tag_ids` 로 바꾼다.** 이름이 그대로면 같은 키가 요청에선 id 배열, 응답에선 이름 배열이 돼 읽는 쪽이 매번 헷갈린다. `toDraft` 도 이름이 아니라 id 를 받으므로 `(post, tagIds)` 두 인자를 받는다.

## 10. 마이그레이션

### 10.1 이관 순서

1. `tags` · `post_tags` 생성, 인덱스·제약
2. `posts.tags` 의 값을 `tags` 로 승격 (아래 대표 표기 규칙)
3. `post_tags` 채우기
4. `posts.tags` 컬럼 · GIN 인덱스 · 체크 제약 제거
5. grant + RLS 정책 — 공개 `select using (true)`, admin write

**대표 표기는 "가장 오래된 글에, 그 글 안에서 가장 앞에" 나온 것으로 정한다.** Postgres 행에는 자연스러운 "먼저 뜬" 순서가 없어서, 규칙을 안 박으면 어떤 표기가 살아남는지가 실행 계획에 따라 달라진다.

```sql
insert into public.tags (name)
select distinct on (lower(t.tag)) t.tag
from public.posts p, unnest(p.tags) with ordinality as t(tag, ord)
order by lower(t.tag), p.created_at, t.ord;
```

**연결은 반드시 `distinct` 로 채운다.** `text[]` 는 중복을 막지 않아서 한 글에 `React, react` 나 같은 문자열이 두 번 들어 있을 수 있다. 둘 다 같은 `tag_id` 로 접히므로 그대로 넣으면 `(post_id, tag_id)` PK 가 `23505` 를 내고 **마이그레이션 전체가 롤백된다.**

```sql
insert into public.post_tags (post_id, tag_id)
select distinct p.id, tg.id
from public.posts p, unnest(p.tags) as t(tag)
join public.tags tg on lower(tg.name) = lower(t.tag);
```

> **표기가 갈린 태그는 여기서 하나로 접힌다.** `React` 와 `react` 가 둘 다 있었다면 한 태그가 되고, 되돌릴 수 없다. 이 작업의 목적이지만 데이터가 줄어드는 변경이므로, 로컬에서 2단계 결과를 먼저 눈으로 확인한 뒤 원격에 민다.

RLS 는 posts 와 같은 모양이다.

```sql
grant select on table public.tags, public.post_tags to anon, authenticated;
grant insert, update, delete on table public.tags, public.post_tags to authenticated;
```

`posts` 에는 지금 `delete` grant 가 별도 마이그레이션에 있다([20260806000000](../../../supabase/migrations/20260806000000_posts_admin_delete_policy.sql)). 새 테이블은 처음부터 네 동작을 함께 연다.

### 10.2 `seed.sql` 이 먼저 고쳐져야 한다

[seed.sql](../../../supabase/seed.sql) 은 `posts` 에 `status` 와 `tags` 를 직접 넣는다. **`status` 는 이미 [20260806010000](../../../supabase/migrations/20260806010000_drop_post_status.sql) 에서 사라졌으므로 `db reset` 은 지금도 깨진다.** 여기에 `tags` 까지 사라지면 두 겹으로 깨진다.

`db reset` 은 이 작업의 전제(`npm run db:types` 재생성, 이관 통합 테스트)라서 선택이 아니다. seed 를 글 삽입 → `tags` 삽입 → `post_tags` 연결 순으로 다시 쓰는 것을 구현 범위에 넣는다.

### 10.3 배포 창 — 확장/축소로 나눌지

이 마이그레이션은 `posts.tags` 를 **제거**하므로, 마이그레이션과 앱 배포 사이에 어느 쪽이 먼저 가든 어긋나는 창이 생긴다.

| 먼저 간 것 | 그동안 깨지는 것 |
| --- | --- |
| 마이그레이션 | `/api/posts`(동적 라우트) 500, 다음 빌드·재검증 실패, 어드민 저장 실패 |
| 앱 배포 | 새 `tags` 관계가 없어 빌드·조회 실패 |

**이미 구운 정적 HTML 은 어느 쪽이든 멀쩡하다.** `/blog` 와 `/blog/[slug]` 는 방문 시 DB 를 안 건드리기 때문이다. 그래서 실제 피해는 "그 창 동안 글을 쓰거나 재배포하면 실패한다" 로 좁혀진다.

정석은 확장/축소다 — 마이그레이션 A(생성·백필, `posts.tags` 유지) → 앱 배포 → 마이그레이션 B(컬럼 제거). 대신 B 를 잊으면 `posts.tags` 가 아무도 안 읽는 낡은 사본으로 남는다. **이 저장소는 지금도 마이그레이션 3개가 원격에 안 밀린 상태라, 그 위험이 이론이 아니다.**

**한 파일로 간다.** 이 저장소는 마이그레이션이 몇 주씩 밀리는 게 관측된 사실이라, 축소 마이그레이션이 방치될 위험이 배포 창 몇 분보다 크다. 대신 **push 와 배포를 붙여서 하고, 그 사이에는 글을 쓰지 않는다** 를 운영 규칙으로 지킨다.

## 11. 테스트

| 대상 | 방법 |
| --- | --- |
| `getPosts` 되접기 | 조인 응답 → `tags: string[]`, 이름순 정렬, 태그 0개 글 |
| `toUpsertInput` | `string[]` 계약 (쉼표 분해가 사라진 자리) |
| `/api/admin/tags` POST·PATCH | 가드 통과/거부, 중복 이름 409 |
| `/api/admin/tags/[id]` DELETE | 연결된 글 있을 때 409, 없을 때 204, 없는 id 404 |
| `mapWriteError` | `23503` → 409 |
| `TagManagerDialog` | 이름 수정이 목록에 반영되는지, 글 수 0이 아닌 행의 삭제가 막히는지, 지운 태그가 선택에서 빠지는지 |
| 마이그레이션 | `npm run test:integration` — 이관 뒤 글별 태그가 이관 전과 **`lower` 로 정규화했을 때** 같은 집합인지 |

**이관 테스트는 원문 문자열로 비교하면 안 된다.** `React` 와 `react` 를 하나로 접는 게 목적이라 비대표 표기를 쓰던 글은 이관 전후의 문자열 집합이 당연히 달라진다. 원문끼리 견주면 **정상적인 이관에서 테스트가 실패한다.**

`TagPicker` 의 토글은 `TagManagerDialog` 와 에디터 저장 계약이 이미 덮으므로 따로 두지 않는다.

## 12. 범위 밖

- 태그 병합(둘을 하나로 합치기) — 이름 수정으로 대체 가능한 경우가 대부분이다
- 태그별 설명 · 색 · 대표 이미지
- 태그 전용 공개 페이지 `/blog/tags/[tag]`
- `/blog` 필터에서 등록만 되고 안 쓰인 태그 노출
- 글 편집 화면 밖(예: 전용 어드민 라우트)에서의 태그 관리
- **같은 글에 대한 동시 저장 직렬화** — advisory lock·낙관적 버전 모두 안 넣는다. 13절에 증상만 남긴다

## 13. 알려진 함정

- **마이그레이션 3개가 아직 원격에 안 밀렸다**([admin-auth-rollout.md](../../admin-auth-rollout.md)). 여기에 4번째가 쌓인다. 원격은 밀린 순서대로 전부 나가야 한다.
- **`db reset` 은 지금도 깨져 있다**(10.2절). `seed.sql` 이 사라진 `status` 를 아직 넣는다. 이 작업의 첫 삽은 스키마가 아니라 seed 다.
- **`npm run db:types` 는 로컬 Supabase(Docker)가 떠 있어야 돈다.** 재생성 전에는 타입이 옛 스키마라 `type-check` 가 엉뚱한 데서 터진다.
- **조인 결과의 태그 순서는 비결정적이다**(6.3절). 정렬하지 않으면 정적 HTML 이 빌드마다 흔들린다.
- **`posts.tags` 제거는 `Post` 타입의 모양을 바꾼다**(6.2절). `select('*')` 로 읽는 자리가 공개 fetcher 말고도 **어드민 편집 라우트와 쓰기 두 함수까지 셋**이다(6.4절). 하나라도 빠뜨리면 타입 검사가 터지거나 편집 폼이 태그 없이 열린다.
- **글 저장은 원자적이지 않다**(2.2절). 신규는 보상 삭제로 되돌리지만, 그 삭제까지 실패하면 태그 없는 글이 남는다. 수정은 재저장으로 복구된다.
- **`post_tags` 재동기화는 delete-then-insert 다.** 같은 태그를 다시 넣는 경우까지 지웠다 넣으므로, 실패 창이 "태그가 하나도 없는 상태"를 스칠 수 있다.
- **같은 글을 두 탭에서 동시에 저장하면 태그가 섞인다.** 재동기화가 delete→insert 두 문장이라 A삭제→B삭제→A삽입→B삽입 순서면 최종 연결이 두 요청의 합집합이 되거나 겹친 태그에서 `23505` 가 난다. 본문은 마지막 요청인데 태그만 다른 상태가 그대로 굳는다. 운영자가 한 명이라 안 막기로 했다(12절) — 증상을 알아두고, 겹쳤다 싶으면 다시 저장한다.
- **에디터의 선택 상태는 이름이 아니라 id 다**(8절). 이름으로 들면 모달에서 이름을 고치는 순간 선택이 끊긴다.
- **삭제 버튼 비활성화는 인가가 아니다.** FK 가 최종 집행자다.
- **`mapWriteError` 가 `23503` 을 모르면 정상 거부가 500 으로 보인다**(7절).
- **`/api/posts` 응답 모양이 바뀌지 않는다.** `tags` 는 여전히 문자열 배열이다 — 되접기 덕분이고, 이걸 깨면 외부 소비자가 조인 구조를 그대로 받는다.
