create policy "Admin insert post images" on storage.objects
  for insert with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = 'posts'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admin select post images" on storage.objects
  for select using (
    bucket_id = 'post-images'
    and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );
