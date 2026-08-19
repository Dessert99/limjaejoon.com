
drop index if exists posts_series_idx;

alter table public.posts drop column if exists series;
