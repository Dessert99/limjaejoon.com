grant insert, update on table public.posts to authenticated;

create policy "Admin select all posts" on public.posts
  for select using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin insert posts" on public.posts
  for insert with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin update posts" on public.posts
  for update using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
              with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
