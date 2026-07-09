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
