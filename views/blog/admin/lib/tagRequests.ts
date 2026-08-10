/** 태그 관리 — Route Handler 호출 네 벌 */
import type { Tag, TagWithUsage } from '../../lib/tag.types';
// barrel(@/shared/api) 대신 client 모듈을 직접 import — 서버 전용 코드(next/headers)가 클라 번들에 섞이는 것을 막는다
import { clientFetchJson } from '@/lib/http/client';

/** 등록된 태그를 글 수와 함께 읽는다 */
export const fetchTags = async (): Promise<TagWithUsage[]> => {
  const { tags } = await clientFetchJson<{ tags: TagWithUsage[] }>(
    '/api/admin/tags'
  );

  return tags;
};

/** 태그를 새로 만든다 */
export const createTag = async (name: string): Promise<Tag> => {
  const { tag } = await clientFetchJson<{ tag: Tag }>('/api/admin/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  return tag;
};

/** 태그 이름을 고친다 — 붙어 있는 글은 tag_id 를 보므로 함께 따라온다 */
export const renameTag = async (id: string, name: string): Promise<Tag> => {
  const { tag } = await clientFetchJson<{ tag: Tag }>(`/api/admin/tags/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  return tag;
};

/** 태그를 지운다 — 연결된 글이 있으면 서버가 409 로 막는다 (204 라 본문이 없다) */
export const deleteTag = async (id: string): Promise<void> => {
  await clientFetchJson<null>(`/api/admin/tags/${id}`, { method: 'DELETE' });
};
