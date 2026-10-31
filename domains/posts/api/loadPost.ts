import { cache } from 'react';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { getPostBySlug, getPosts } from '@/domains/posts/api/posts';

/** 주소의 글 한 편. generateMetadata와 페이지가 같은 글을 두 번 안 읽도록 요청 단위로 캐시한다. */
export const loadPost = cache(async (slug: string) => {
  return getPostBySlug(createSupabaseStaticClient(), slug);
});

/** 발행된 글 목록. 한 요청 안에서 여러 번 불러도 한 번만 읽는다. */
export const loadPublishedPosts = cache(async () => {
  return getPosts(createSupabaseStaticClient());
});
