import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { BookRef } from '../lib/book.types';
import type { Post, PostListItem } from '../lib/post.types';

type BookJoin = { books: BookRef | null };

/** 조인으로 딸려 온 books 중첩을 book 하나로 눌러 화면이 쓰기 좋게 만든다. */
const foldBook = <T>(row: T & BookJoin): T & { book: BookRef | null } => {
  const { books, ...rest } = row;

  return { ...rest, book: books } as T & { book: BookRef | null };
};

/** 발행 최신순 글 목록. 본문은 빼고 목록·검색에 필요한 열만 가져온다. */
export const getPosts = async (
  client: SupabaseClient<Database>
): Promise<PostListItem[]> => {
  const { data, error } = await client
    .from('posts')
    .select(
      'id, slug, title, description, kind, published_at, books(slug, title)'
    )
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (
    (data ?? []) as unknown as (Omit<PostListItem, 'book'> & BookJoin)[]
  ).map(foldBook);
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
    .select('*, books(slug, title)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return foldBook(data as unknown as Omit<Post, 'book'> & BookJoin);
};
