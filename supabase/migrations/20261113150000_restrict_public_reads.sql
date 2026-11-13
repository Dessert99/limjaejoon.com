-- 공개 글은 서버가 service role 키로 읽는다. 공개 키만 든 요청에는 테이블을 열지 않는다
revoke select on table public.posts, public.books from anon;

-- 가입만 하면 authenticated로 다시 읽을 수 있으니 posts 읽기는 관리자만 남긴다
drop policy if exists "Public read posts" on public.posts;

create policy "Admin read posts" on public.posts
  for select using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- 공개 화면은 service role로, 관리자는 "Admin write books"(for all)로 읽으니 모두에게 열던 읽기 정책은 지운다
drop policy if exists "Public read books" on public.books;
