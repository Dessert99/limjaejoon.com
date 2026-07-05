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
  tags,
  status,
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
- `published` 글만 공개 API에서 조회되는지
$$,
    array['Next.js', 'Supabase'],
    'published',
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
    array['MDX', 'Blog'],
    'published',
    '2026-04-02T00:00:00Z'
  );
