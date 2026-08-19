import { clientFetchJson } from '@/lib/http/client';

export const deletePost = async (id: string): Promise<void> => {
  await clientFetchJson<null>(`/api/admin/posts/${id}`, { method: 'DELETE' });
};
