import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { Post, UpsertPostInput } from '../lib/post.types';

type PostRow = Database['public']['Tables']['posts']['Row'];

/** 행이 안 돌아온 쓰기를 성공으로 넘기지 않게 막는다. 타입상 null이 열려 있다. */
const assertRow = (row: PostRow | null): PostRow => {
  if (!row) {
    throw new Error('Post write returned no data');
  }

  return row;
};

/** posts 테이블에 그대로 들어가는 열만 남긴다. 태그는 별도 테이블이라 뺀다. */
const toColumns = (input: UpsertPostInput) => {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    published_at: input.published_at,
    content_markdown: input.content_markdown,
  };
};

/** 방금 연결한 태그 id를 이름으로 되읽어 응답에 실어 보낸다. */
const fetchTagNames = async (
  client: SupabaseClient<Database>,
  ids: string[]
): Promise<string[]> => {
  if (ids.length === 0) {
    return [];
  }

  const { data, error } = await client
    .from('tags')
    .select('name')
    .in('id', ids);

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((tag) => {
      return tag.name;
    })
    .sort();
};

/** 글의 태그 연결을 통째로 갈아끼운다. 지우고 다시 넣어야 뺀 태그가 남지 않는다. */
const syncPostTags = async (
  client: SupabaseClient<Database>,
  postId: string,
  tagIds: string[]
): Promise<void> => {
  const { error: clearError } = await client
    .from('post_tags')
    .delete()
    .eq('post_id', postId);

  if (clearError) {
    throw clearError;
  }

  if (tagIds.length === 0) {
    return;
  }

  const { error } = await client.from('post_tags').insert(
    tagIds.map((tagId) => {
      return { post_id: postId, tag_id: tagId };
    })
  );

  if (error) {
    throw error;
  }
};

/** 글을 새로 쓰고 태그까지 이어 붙인다. */
export const createAdminPost = async (
  client: SupabaseClient<Database>,
  input: UpsertPostInput
): Promise<Post> => {
  const { data, error } = await client
    .from('posts')
    .insert(toColumns(input))
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  const row = assertRow(data);

  try {
    await syncPostTags(client, row.id, input.tag_ids);
  } catch (linkError) {
    // 태그 연결이 깨지면 태그 없는 글만 남으므로 방금 만든 글을 되돌린다
    await client.from('posts').delete().eq('id', row.id);
    throw linkError;
  }

  return { ...row, tags: await fetchTagNames(client, input.tag_ids) };
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

/** 글을 고치고 태그 연결도 새 목록으로 맞춘다. */
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
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  const row = assertRow(data);

  await syncPostTags(client, row.id, input.tag_ids);

  return { ...row, tags: await fetchTagNames(client, input.tag_ids) };
};
