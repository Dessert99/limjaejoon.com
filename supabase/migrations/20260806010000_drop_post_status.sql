
drop policy if exists "Public read published posts" on public.posts;
drop policy if exists "Admin select all posts" on public.posts;

create policy "Public read posts" on public.posts
  for select using (true);

drop index if exists posts_status_published_at_idx;

alter table public.posts drop column if exists status;

drop type if exists public.post_status;

update public.posts
  set published_at = created_at
  where published_at is null;

alter table public.posts
  alter column published_at set default now(),
  alter column published_at set not null;

create index if not exists posts_published_at_idx
  on public.posts (published_at desc);
