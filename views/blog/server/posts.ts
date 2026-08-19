import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { Post, PostListItem } from '../lib/post.types';

const TAGS_JOIN = 'post_tags(tags(name))';

const POST_LIST_SELECT = `id, slug, title, description, published_at, ${TAGS_JOIN}`;

type TagsJoin = { post_tags: { tags: { name: string } | null }[] };

const foldTags = <T>(row: T & TagsJoin): T & { tags: string[] } => {
  const { post_tags: links, ...rest } = row;

  return {
    ...rest,
    tags: links
      .map((link) => {
        return link.tags?.name;
      })
      .filter((name): name is string => {
        return Boolean(name);
      })
      .sort(),
  } as T & { tags: string[] };
};

export const getPosts = async (
  client: SupabaseClient<Database>
): Promise<PostListItem[]> => {
  const { data, error } = await client
    .from('posts')
    .select(POST_LIST_SELECT)
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as unknown as (Omit<PostListItem, 'tags'> & TagsJoin)[]
  ).map(foldTags);
};

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

export const getPostBySlug = async (
  client: SupabaseClient<Database>,
  slug: string
): Promise<Post | null> => {
  const { data, error } = await client
    .from('posts')
    .select(`*, ${TAGS_JOIN}`)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return foldTags(data as unknown as Omit<Post, 'tags'> & TagsJoin);
};
