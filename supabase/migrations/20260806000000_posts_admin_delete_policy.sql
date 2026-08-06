-- authenticated 가 posts 삭제를 시도할 수 있게 grant (RLS 가 실제 허용을 통제)
grant delete on table public.posts to authenticated;

-- 삭제: 지워질 행이 admin claim 을 만족해야 한다
create policy "Admin delete posts" on public.posts
  for delete using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
