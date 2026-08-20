import { clientFetchJson } from '@/lib/http/client';

/** 본문에 넣을 이미지를 올리고 공개 주소를 받아온다. */
export const uploadPostImage = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append('file', file);

  // FormData는 경계 문자열이 붙은 Content-Type을 브라우저가 직접 붙여야 한다
  const { url } = await clientFetchJson<{ url: string }>('/api/admin/images', {
    method: 'POST',
    body: formData,
  });

  return url;
};
