/** posts 엔티티의 admin write helper — Route Handler 밖에서 Supabase mutation 을 캡슐화한다 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/api';
import type { Post, PostStatus } from '../model/post.types';

/** admin create/update payload — 삭제 없는 1차 editor 저장 계약 */
export type UpsertPostInput = {
  title: string;
  slug: string;
  description: string;
  series: string | null;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
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
