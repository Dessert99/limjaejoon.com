import type { Tag, TagWithUsage } from '../../lib/tag.types';
import { clientFetchJson } from '@/lib/http/client';

export const fetchTags = async (): Promise<TagWithUsage[]> => {
  const { tags } = await clientFetchJson<{ tags: TagWithUsage[] }>(
    '/api/admin/tags'
  );

  return tags;
};

export const createTag = async (name: string): Promise<Tag> => {
  const { tag } = await clientFetchJson<{ tag: Tag }>('/api/admin/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  return tag;
};

export const renameTag = async (id: string, name: string): Promise<Tag> => {
  const { tag } = await clientFetchJson<{ tag: Tag }>(`/api/admin/tags/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  return tag;
};

export const deleteTag = async (id: string): Promise<void> => {
  await clientFetchJson<null>(`/api/admin/tags/${id}`, { method: 'DELETE' });
};
