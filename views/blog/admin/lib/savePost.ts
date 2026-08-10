/** 글 저장 — 신규는 POST, 수정은 PATCH 로 갈린다 */
import type { Post } from '../../lib/post.types';
import type { UpsertPostInput } from '../../lib/post.types';
import { clientFetchJson } from '@/lib/http/client';

/** id 가 있으면 수정, 없으면 생성한다 */
export const savePost = async (
  input: UpsertPostInput,
  id?: string
): Promise<Post> => {
  const { post } = await clientFetchJson<{ post: Post }>(
    id ? `/api/admin/posts/${id}` : '/api/admin/posts',
    {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );

  return post;
};
