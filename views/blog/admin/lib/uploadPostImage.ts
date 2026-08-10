/** 본문 이미지 업로드 — Storage 에 올리고 공개 URL 을 돌려받는다 */
// barrel(@/shared/api) 대신 client 모듈을 직접 import — 서버 전용 코드(next/headers)가 클라 번들에 섞이는 것을 막는다
import { clientFetchJson } from '@/lib/http/client';

/** Content-Type 을 직접 넣지 않는다 — FormData 는 boundary 를 포함한 헤더를 브라우저가 붙여야 한다 */
export const uploadPostImage = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append('file', file);

  const { url } = await clientFetchJson<{ url: string }>('/api/admin/images', {
    method: 'POST',
    body: formData,
  });

  return url;
};
