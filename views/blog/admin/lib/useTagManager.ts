'use client';

import { useState } from 'react';
import type { TagWithUsage } from '../../lib/tag.types';
import { createTag, deleteTag, fetchTags, renameTag } from './tagRequests';

const readMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : '요청에 실패했다';
};

export const useTagManager = (onTagsChange: (tags: TagWithUsage[]) => void) => {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const run = async (action: () => Promise<void>): Promise<boolean> => {
    setPending(true);
    setError(null);

    try {
      await action();
      onTagsChange(await fetchTags());

      return true;
    } catch (caught) {
      setError(readMessage(caught));

      return false;
    } finally {
      setPending(false);
    }
  };

  const create = (name: string) => {
    return run(async () => {
      await createTag(name);
    });
  };

  const rename = (id: string, name: string) => {
    return run(async () => {
      await renameTag(id, name);
    });
  };

  const remove = (id: string) => {
    return run(async () => {
      await deleteTag(id);
    });
  };

  return { error, pending, create, rename, remove };
};
