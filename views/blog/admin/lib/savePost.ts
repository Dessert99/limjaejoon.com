/** 글 저장 — 신규는 POST, 수정은 PATCH 로 갈린다 */
import type { Post } from '../../lib/post.types';
import type { UpsertPostInput } from '../../lib/post.types';
// barrel(@/shared/api) 대신 client 모듈을 직접 import — 서버 전용 코드(next/headers)가 클라 번들에 섞이는 것을 막는다
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
