/** posts 엔티티의 공개 읽기 fetcher — React 비의존 Supabase transport */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/api';
import type { Post, PostListItem, PostSearchParams } from '../model/post.types';

const POST_LIST_SELECT =
  'id, slug, title, description, tags, series, published_at';

/** 글 목록을 최신 발행일 순서로 조회한다 */
export const getPosts = async (
  client: SupabaseClient<Database>,
  params?: PostSearchParams
): Promise<PostListItem[]> => {
  let query = client
    .from('posts')
    .select(POST_LIST_SELECT)
    .order('published_at', { ascending: false });

  if (params?.series) {
    query = query.eq('series', params.series);
  }

  if (params?.tag) {
    query = query.contains('tags', [params.tag]);
  }

  if (params?.q) {
    const term = params.q.replaceAll('%', '\\%').replaceAll(',', ' ');
    query = query.or(
      `title.ilike.%${term}%,description.ilike.%${term}%,content_markdown.ilike.%${term}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
};

/** SSG 경로 생성을 위해 slug 만 조회한다 */
export const getPostSlugs = async (
  client: SupabaseClient<Database>
): Promise<string[]> => {
  const { data, error } = await client
    .from('posts')
    .select('slug')
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

/** slug 로 단일 글을 조회한다 */
export const getPostBySlug = async (
  client: SupabaseClient<Database>,
  slug: string
): Promise<Post | null> => {
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};
