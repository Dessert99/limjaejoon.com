import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { Post, PostListItem } from '../lib/post.types';

type TagsJoin = { post_tags: { tags: { name: string } | null }[] };

/** 조인으로 딸려 온 post_tags 중첩을 태그 이름 배열로 눌러 화면이 쓰기 좋게 만든다. */
const foldTags = <T>(row: T & TagsJoin): T & { tags: string[] } => {
  const { post_tags: links, ...rest } = row;

  return {
    ...rest,
    tags: links
      // 조인이 태그를 못 읽어 오면 null이 섞인다. 이름 없는 링크는 버린다
      .map((link) => {
        return link.tags?.name;
      })
      .filter((name): name is string => {
        return Boolean(name);
      })
      .sort(),
  } as T & { tags: string[] };
};

/** 발행 최신순 글 목록. 본문은 빼고 목록·검색에 필요한 열만 가져온다. */
export const getPosts = async (
  client: SupabaseClient<Database>
): Promise<PostListItem[]> => {
  const { data, error } = await client
    .from('posts')
    .select('id, slug, title, description, published_at, post_tags(tags(name))')
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as unknown as (Omit<PostListItem, 'tags'> & TagsJoin)[]
  ).map(foldTags);
};

/** 정적 경로를 만들 때 쓸 주소 목록. */
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

/** 사이트맵 항목. 수정일이 있어야 크롤러가 다시 읽을 글을 고른다. */
export const getPostSitemapEntries = async (
  client: SupabaseClient<Database>
): Promise<{ slug: string; updated_at: string }[]> => {
  const { data, error } = await client
    .from('posts')
    .select('slug, updated_at')
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

/** 주소로 글 한 편. 없으면 null이라 페이지가 404로 넘긴다. */
export const getPostBySlug = async (
  client: SupabaseClient<Database>,
  slug: string
): Promise<Post | null> => {
  const { data, error } = await client
    .from('posts')
    .select('*, post_tags(tags(name))')
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
