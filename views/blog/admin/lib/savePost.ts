import type { Post } from '../../lib/post.types';
import type { UpsertPostInput } from '../../lib/post.types';
import { clientFetchJson } from '@/lib/http/client';

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
