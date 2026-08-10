'use client';

/** 태그 관리 모달의 요청 상태 — 목록 자체는 부모가 들고, 여기서는 갱신만 통보한다 */
import { useState } from 'react';
import type { TagWithUsage } from '../../lib/tag.types';
import { createTag, deleteTag, fetchTags, renameTag } from './tagRequests';

const readMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : '요청에 실패했다';
};

/** 태그를 만들고 고치고 지운다. 매번 목록을 다시 읽어 글 수까지 맞춘다 */
export const useTagManager = (onTagsChange: (tags: TagWithUsage[]) => void) => {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  /** 성공 여부를 돌려준다 — 실패를 성공으로 읽으면 호출부가 입력을 지워 친 값이 사라진다 */
  const run = async (action: () => Promise<void>): Promise<boolean> => {
    setPending(true);
    setError(null);

    try {
      await action();
      // 글 수는 서버만 안다 — 낙관적으로 깁지 않고 다시 읽는다
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
