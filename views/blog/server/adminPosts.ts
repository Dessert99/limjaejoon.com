import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { Post, UpsertPostInput } from '../lib/post.types';

/** 행이 안 돌아온 쓰기를 성공으로 넘기지 않게 막는다. 타입상 null이 열려 있다. */
const assertPost = (row: Post | null): Post => {
  if (!row) {
    throw new Error('Post write returned no data');
  }

  return row;
};

/** posts 테이블에 그대로 들어가는 열. 이야기는 책을 비워 DB 제약과 맞춘다. */
const toColumns = (input: UpsertPostInput) => {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    kind: input.kind,
    book_id: input.kind === 'concept' ? input.book_id : null,
    published_at: input.published_at,
    content_markdown: input.content_markdown,
  };
};

/** 쓰기 응답에 딸려 온 books 중첩을 book 하나로 눌러 공개 조회와 같은 모양으로 맞춘다. */
const foldBook = (row: Record<string, unknown> | null): Post | null => {
  if (!row) {
    return null;
  }

  const { books, ...rest } = row;

  return { ...rest, book: books ?? null } as Post;
};

/** 글을 새로 쓴다. */
export const createAdminPost = async (
  client: SupabaseClient<Database>,
  input: UpsertPostInput
): Promise<Post> => {
  const { data, error } = await client
    .from('posts')
    .insert(toColumns(input))
    .select('*, books(slug, title)')
    .single();

  if (error) {
    throw error;
  }

  return assertPost(foldBook(data));
};

/** 글을 지우고 실제로 지워졌는지 알린다. 이미 없으면 false다. */
export const deleteAdminPost = async (
  client: SupabaseClient<Database>,
  id: string
): Promise<boolean> => {
  const { data, error } = await client
    .from('posts')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    throw error;
  }

  return (data?.length ?? 0) > 0;
};

/** 글을 고친다. */
export const updateAdminPost = async (
  client: SupabaseClient<Database>,
  id: string,
  input: UpsertPostInput
): Promise<Post> => {
  const { data, error } = await client
    .from('posts')
    // updated_at은 DB가 안 건드려서 여기서 찍는다. 빠지면 사이트맵이 수정을 못 알아챈다
    .update({ ...toColumns(input), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, books(slug, title)')
    .single();

  if (error) {
    throw error;
  }

  return assertPost(foldBook(data));
};
