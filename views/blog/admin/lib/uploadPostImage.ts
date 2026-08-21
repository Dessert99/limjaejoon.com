import { clientFetchJson } from '@/lib/http/client';
import { shrinkImage } from './shrinkImage';

/** 본문에 넣을 이미지를 줄여 올리고 공개 주소를 받아온다. */
export const uploadPostImage = async (
  file: File,
  name: string
): Promise<string> => {
  const formData = new FormData();

  formData.append('file', await shrinkImage(file, name));

  // FormData는 경계 문자열이 붙은 Content-Type을 브라우저가 직접 붙여야 한다
  const { url } = await clientFetchJson<{ url: string }>('/api/admin/images', {
    method: 'POST',
    body: formData,
  });

  return url;
};
