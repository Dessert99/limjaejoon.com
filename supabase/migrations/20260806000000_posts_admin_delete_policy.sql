grant delete on table public.posts to authenticated;

create policy "Admin delete posts" on public.posts
  for delete using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
