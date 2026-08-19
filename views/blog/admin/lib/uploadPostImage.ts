import { clientFetchJson } from '@/lib/http/client';

export const uploadPostImage = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append('file', file);

  const { url } = await clientFetchJson<{ url: string }>('/api/admin/images', {
    method: 'POST',
    body: formData,
  });

  return url;
};
