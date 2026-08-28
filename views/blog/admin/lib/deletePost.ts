import { clientFetchJson } from '@/lib/http/client';

/** 글 삭제 요청. 실패하면 clientFetchJson이 메시지를 담아 던진다. */
export const deletePost = async (id: string): Promise<void> => {
  await clientFetchJson<null>(`/api/admin/posts/${id}`, { method: 'DELETE' });
};
