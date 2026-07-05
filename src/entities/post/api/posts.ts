/** posts 엔티티의 공개 읽기 fetcher — React 비의존 Supabase transport */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/api';
import type { Post, PostListItem } from '../model/post.types';

const POST_LIST_SELECT = 'id, slug, title, description, tags, published_at';

/** published 글 목록을 최신 발행일 순서로 조회한다 */
export const getPublishedPosts = async (
  client: SupabaseClient<Database>
): Promise<PostListItem[]> => {
  const { data, error } = await client
    .from('posts')
    .select(POST_LIST_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

/** SSG 경로 생성을 위해 published 글 slug 만 조회한다 */
export const getPublishedPostSlugs = async (
  client: SupabaseClient<Database>
): Promise<string[]> => {
  const { data, error } = await client
    .from('posts')
    .select('slug')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    data?.map((post) => {
      return post.slug;
    }) ?? []
  );
};

/** slug 와 published 상태가 일치하는 단일 글을 조회한다 */
export const getPublishedPostBySlug = async (
  client: SupabaseClient<Database>,
  slug: string
): Promise<Post | null> => {
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};
