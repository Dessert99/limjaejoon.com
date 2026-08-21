'use client';

import { useState } from 'react';
import type { TagWithUsage } from '../../lib/tag.types';
import { createTag, deleteTag, fetchTags, renameTag } from './tagRequests';

/** 서버가 준 메시지를 그대로 보여주고, 정체 모를 오류만 기본 문구로 덮는다. */
const readMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : '요청에 실패했다';
};

/** 태그 생성·수정·삭제. 성공 여부를 돌려줘 화면이 입력칸을 비울지 정한다. */
export const useTagManager = (onTagsChange: (tags: TagWithUsage[]) => void) => {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const run = async (action: () => Promise<void>): Promise<boolean> => {
    setPending(true);
    setError(null);

    try {
      await action();
      // 글 수까지 맞추려면 응답 하나로는 부족해서 목록을 통째로 다시 받는다
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
