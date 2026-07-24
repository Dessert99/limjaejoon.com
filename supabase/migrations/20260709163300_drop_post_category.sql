drop index if exists public.posts_category_idx;

alter table public.posts
  drop column if exists category;

alter table public.posts
  drop constraint if exists posts_tags_not_empty;

alter table public.posts
  add constraint posts_tags_not_empty
  check (coalesce(array_length(tags, 1), 0) > 0);
