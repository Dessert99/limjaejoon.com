-- 태그를 글과 독립적으로 사는 대상으로 승격한다.
-- posts.tags text[] 는 사라지고, tags ⋈ post_tags 가 유일한 출처가 된다.

create table public.tags (
  id         uuid primary key default gen_random_uuid(),
  -- lower(name) unique 만으로는 'React' 와 'React ' 가 공존한다 — 표기 흔들림을 막는 게 이 작업의 목적이다
  name       text not null constraint tags_name_trimmed check (name = btrim(name) and name <> ''),
  created_at timestamptz not null default now()
);

create unique index tags_name_lower_key on public.tags (lower(name));

alter table public.tags enable row level security;

create policy "Public read tags" on public.tags
  for select using (true);

create policy "Admin write tags" on public.tags
  for all using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
          with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create table public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  -- restrict 가 "연결된 글이 있으면 못 지운다" 의 집행자다. 앱이 조회 후 지우면 그 사이에 글이 저장될 때 샌다
  tag_id  uuid not null references public.tags (id) on delete restrict,
  primary key (post_id, tag_id)
);

-- 복합 PK 의 선두가 post_id 라 태그 삭제 가드의 tag_id 단독 조회를 못 받쳐준다
create index post_tags_tag_id_idx on public.post_tags (tag_id);

alter table public.post_tags enable row level security;

create policy "Public read post_tags" on public.post_tags
  for select using (true);

create policy "Admin write post_tags" on public.post_tags
  for all using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
          with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

grant select on table public.tags, public.post_tags to anon, authenticated;
grant insert, update, delete on table public.tags, public.post_tags to authenticated;

-- 대표 표기는 '가장 오래된 글에, 그 글 안에서 가장 앞' 이다 — 규칙을 박지 않으면 실행 계획에 따라 살아남는 표기가 달라진다
insert into public.tags (name)
select distinct on (lower(btrim(t.tag))) btrim(t.tag)
from public.posts p, unnest(p.tags) with ordinality as t(tag, ord)
where btrim(t.tag) <> ''
order by lower(btrim(t.tag)), p.created_at, t.ord;

-- distinct 가 없으면 한 글의 'React, react' 가 같은 tag_id 로 접혀 PK 를 위반하고 마이그레이션 전체가 롤백된다
insert into public.post_tags (post_id, tag_id)
select distinct p.id, tg.id
from public.posts p, unnest(p.tags) as t(tag)
join public.tags tg on lower(tg.name) = lower(btrim(t.tag));

alter table public.posts drop constraint if exists posts_tags_not_empty;

drop index if exists posts_tags_idx;

alter table public.posts drop column tags;
