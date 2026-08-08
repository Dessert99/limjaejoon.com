-- db reset 시 마이그레이션 이후 자동 실행되는 더미 데이터 (학습용)
insert into public.users (email, display_name) values
  ('jaejoon@limjaejoon.com', '임재준'),
  ('ada@example.com', 'Ada Lovelace'),
  ('alan@example.com', 'Alan Turing');

insert into public.posts (
  slug,
  title,
  description,
  content_markdown,
  published_at
) values
  (
    'hello-post',
    '로컬 Supabase 첫 글',
    '로컬 seed 데이터로 확인하는 첫 번째 게시글입니다.',
    $$# 로컬 Supabase 첫 글

이 글은 `supabase/seed.sql`에서 들어간 게시글입니다.

## 확인할 것

- 목록 화면에 제목과 설명이 보이는지
- 상세 화면에서 Markdown 본문이 렌더링되는지
- 태그가 `post_tags` 조인을 거쳐 목록·상세에 함께 실리는지
$$,
    '2026-04-03T00:00:00Z'
  ),
  (
    'second-post',
    '게시글 상세 화면 테스트',
    '상세 라우트와 MDX 렌더링을 확인하기 위한 두 번째 게시글입니다.',
    $$# 게시글 상세 화면 테스트

두 번째 seed 게시글입니다.

## 테스트 포인트

1. `/blog` 목록에서 두 개의 글이 보인다.
2. `/blog/second-post` 상세 페이지로 이동할 수 있다.
3. 태그와 발행일이 함께 표시된다.
$$,
    '2026-04-02T00:00:00Z'
  );

insert into public.tags (name) values
  ('Next.js'),
  ('Supabase'),
  ('MDX'),
  ('Blog');

-- 태그는 글과 따로 서므로 연결도 따로 넣는다 — slug·name 으로 이어 id 를 손으로 적지 않는다
insert into public.post_tags (post_id, tag_id)
select posts.id, tags.id
from (values
  ('hello-post', 'Next.js'),
  ('hello-post', 'Supabase'),
  ('second-post', 'MDX'),
  ('second-post', 'Blog')
) as link(slug, name)
join public.posts on posts.slug = link.slug
join public.tags on tags.name = link.name;

-- 어드민 계정 부트스트랩은 seed.sql 에 두지 않는다. 이 파일은 `db push --include-seed`·`db reset --linked`
-- 로 원격에서도 실행될 수 있어, 공개 레포의 고정 비밀번호 어드민이 프로덕션에 생길 위험이 있다.
-- 로컬 어드민은 원격에 닿을 수 없는 별도 경로로만 만든다: `npm run auth:seed-admin-local` (supabase/seed-local-admin.sql).
