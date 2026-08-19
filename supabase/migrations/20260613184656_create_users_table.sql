create table public.users (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  display_name text not null,
  created_at   timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Public read access" on public.users
  for select using (true);
