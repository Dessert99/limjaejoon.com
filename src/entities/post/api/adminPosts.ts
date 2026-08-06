/** posts 엔티티의 admin write helper — Route Handler 밖에서 Supabase mutation 을 캡슐화한다 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/api';
import type { Post } from '../model/post.types';

/** admin create/update payload — 저장하면 곧 공개다(초안 상태가 없다) */
export type UpsertPostInput = {
  title: string;
  slug: string;
  description: string;
  series: string | null;
  tags: string[];
  published_at: string;
  content_markdown: string;
};

const assertPost = (post: Post | null): Post => {
  if (!post) {
    throw new Error('Post write returned no data');
  }

  return post;
};

/** service role client 로 admin 글을 생성한다 */
export const createAdminPost = async (
  client: SupabaseClient<Database>,
  input: UpsertPostInput
): Promise<Post> => {
  const { data, error } = await client
    .from('posts')
    .insert(input)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return assertPost(data);
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
    .update(input)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return assertPost(data);
};
