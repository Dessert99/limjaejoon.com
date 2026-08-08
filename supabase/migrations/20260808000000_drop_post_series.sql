-- 연재 개념을 걷어낸다 — 글 28편 중 series 를 쓰는 글이 0편이라, 실행된 적 없는 분기만 남아 있었다.
-- 잃는 값이 없다: 이 시점의 모든 행이 null 이다.

drop index if exists posts_series_idx;

alter table public.posts drop column if exists series;
