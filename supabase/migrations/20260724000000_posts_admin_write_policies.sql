-- authenticated 가 posts 에 쓰기를 시도할 수 있게 grant (RLS 가 실제 허용을 통제)
grant insert, update on table public.posts to authenticated;

-- 조회: admin 은 draft 포함 전부 (기존 published-only 정책과 permissive OR 결합)
create policy "Admin select all posts" on public.posts
  for select using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- 삽입: 새로 써질 행이 admin claim 을 만족해야 한다
create policy "Admin insert posts" on public.posts
  for insert with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- 수정: 기존 행(using)과 바뀔 행(with check) 둘 다 통제
create policy "Admin update posts" on public.posts
  for update using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
              with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
