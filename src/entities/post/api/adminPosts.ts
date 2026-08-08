/** posts 엔티티의 admin write helper — Route Handler 밖에서 Supabase mutation 을 캡슐화한다 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/api';
import type { Post } from '../model/post.types';

/** admin create/update payload — tags 는 이름이 아니라 등록된 태그의 id 다 */
export type UpsertPostInput = {
  title: string;
  slug: string;
  description: string;
  tag_ids: string[];
  published_at: string;
  content_markdown: string;
};

type PostRow = Database['public']['Tables']['posts']['Row'];

const assertRow = (row: PostRow | null): PostRow => {
  if (!row) {
    throw new Error('Post write returned no data');
  }

  return row;
};

/** tag_ids 는 posts 의 컬럼이 아니다 — 그대로 넘기면 PostgREST 가 거부한다 */
const toColumns = (input: UpsertPostInput) => {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    published_at: input.published_at,
    content_markdown: input.content_markdown,
  };
};

/** 이름은 별도 조회로 붙인다 — 저장 응답도 조회와 같은 Post 계약이어야 한다 */
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

/** 연결을 통째로 갈아끼운다 — 차집합을 계산하는 것보다 짧고, 결과가 입력과 정확히 같다 */
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

/** service role client 로 admin 글을 생성한다 */
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
    // 되돌리지 않으면 slug unique 탓에 재저장이 409 로 막혀, 태그 없이 공개된 글을 고칠 방법이 사라진다
    await client.from('posts').delete().eq('id', row.id);
    throw linkError;
  }

  return { ...row, tags: await fetchTagNames(client, input.tag_ids) };
};

/** service role client 로 admin 글을 지운다 — 지운 행이 없으면 false */
export const deleteAdminPost = async (
  client: SupabaseClient<Database>,
  id: string
): Promise<boolean> => {
  // 없는 id 로 지워도 Supabase 는 성공이라 답한다 — 지운 행을 돌려받아야 404 를 구분할 수 있다
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

/** service role client 로 admin 글을 수정한다 */
export const updateAdminPost = async (
  client: SupabaseClient<Database>,
  id: string,
  input: UpsertPostInput
): Promise<Post> => {
  const { data, error } = await client
    .from('posts')
    .update(toColumns(input))
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  const row = assertRow(data);

  // 수정은 .update() 라 재시도가 그대로 성립한다 — 보상 삭제가 필요 없다
  await syncPostTags(client, row.id, input.tag_ids);

  return { ...row, tags: await fetchTagNames(client, input.tag_ids) };
};
