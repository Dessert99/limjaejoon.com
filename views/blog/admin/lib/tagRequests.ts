import type { Tag, TagWithUsage } from '../../lib/tag.types';
import { clientFetchJson } from '@/lib/http/client';

/** 태그 전체를 글 수와 함께 받아온다. */
export const fetchTags = async (): Promise<TagWithUsage[]> => {
  const { tags } = await clientFetchJson<{ tags: TagWithUsage[] }>(
    '/api/admin/tags'
  );

  return tags;
};

/** 태그를 새로 만든다. */
export const createTag = async (name: string): Promise<Tag> => {
  const { tag } = await clientFetchJson<{ tag: Tag }>('/api/admin/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  return tag;
};

/** 태그 이름을 고친다. 그 태그가 붙은 글이 전부 따라간다. */
export const renameTag = async (id: string, name: string): Promise<Tag> => {
  const { tag } = await clientFetchJson<{ tag: Tag }>(`/api/admin/tags/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  return tag;
};

/** 태그를 지운다. 글이 붙어 있으면 서버가 막는다. */
export const deleteTag = async (id: string): Promise<void> => {
  await clientFetchJson<null>(`/api/admin/tags/${id}`, { method: 'DELETE' });
};
