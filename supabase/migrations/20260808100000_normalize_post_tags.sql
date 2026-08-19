
create table public.tags (
  id         uuid primary key default gen_random_uuid(),
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
  tag_id  uuid not null references public.tags (id) on delete restrict,
  primary key (post_id, tag_id)
);

create index post_tags_tag_id_idx on public.post_tags (tag_id);

alter table public.post_tags enable row level security;

create policy "Public read post_tags" on public.post_tags
  for select using (true);

create policy "Admin write post_tags" on public.post_tags
  for all using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
          with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

grant select on table public.tags, public.post_tags to anon, authenticated;
grant insert, update, delete on table public.tags, public.post_tags to authenticated;

insert into public.tags (name)
select distinct on (lower(btrim(t.tag))) btrim(t.tag)
from public.posts p, unnest(p.tags) with ordinality as t(tag, ord)
where btrim(t.tag) <> ''
order by lower(btrim(t.tag)), p.created_at, t.ord;

insert into public.post_tags (post_id, tag_id)
select distinct p.id, tg.id
from public.posts p, unnest(p.tags) as t(tag)
join public.tags tg on lower(tg.name) = lower(btrim(t.tag));

alter table public.posts drop constraint if exists posts_tags_not_empty;

drop index if exists posts_tags_idx;

alter table public.posts drop column tags;
