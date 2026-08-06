-- 초안 개념을 걷어낸다 — 저장하면 곧 공개다. status 로 시야를 가르던 정책도 함께 사라진다.
-- 주의: 이 마이그레이션은 남아 있던 draft 글을 그대로 공개 상태로 만든다.

drop policy if exists "Public read published posts" on public.posts;
drop policy if exists "Admin select all posts" on public.posts;

-- 모든 글이 공개다 — 숨길 대상이 없으므로 select 는 조건 없이 허용한다
create policy "Public read posts" on public.posts
  for select using (true);

drop index if exists posts_status_published_at_idx;

alter table public.posts drop column if exists status;

drop type if exists public.post_status;

-- 정렬 기준이라 비어 있으면 목록에서 자리를 못 잡는다 — 작성 시각으로 메운다
update public.posts
  set published_at = created_at
  where published_at is null;

alter table public.posts
  alter column published_at set default now(),
  alter column published_at set not null;

create index if not exists posts_published_at_idx
  on public.posts (published_at desc);
