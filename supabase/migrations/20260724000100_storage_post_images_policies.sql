-- 업로드: post-images 버킷의 posts/ 경로에 admin 만 insert
create policy "Admin insert post images" on storage.objects
  for insert with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = 'posts'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 업로드 응답 RETURNING 이 SELECT 를 요구하므로 admin select 도 둔다
create policy "Admin select post images" on storage.objects
  for select using (
    bucket_id = 'post-images'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );
