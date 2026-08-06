/** 글 삭제 — 되돌릴 수 없어 호출 측이 확인 단계를 거친 뒤에만 부른다 */
// barrel(@/shared/api) 대신 client 모듈을 직접 import — 서버 전용 코드(next/headers)가 클라 번들에 섞이는 것을 막는다
import { clientFetchJson } from '@/shared/api/http/client';

/** 글 하나를 지운다 (204 라 본문이 없다) */
export const deletePost = async (id: string): Promise<void> => {
  await clientFetchJson<null>(`/api/admin/posts/${id}`, { method: 'DELETE' });
};
