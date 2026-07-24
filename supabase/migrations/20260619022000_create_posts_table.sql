create type public.post_status as enum ('draft', 'published');

create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  description      text not null,
  content_markdown text not null,
  tags             text[] not null default '{}',
  status           public.post_status not null default 'draft',
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Public read published posts" on public.posts
  for select using (status = 'published');
