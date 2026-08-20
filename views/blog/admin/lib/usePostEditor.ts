'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deletePost } from './deletePost';
import { savePost } from './savePost';
import { uploadPostImage } from './uploadPostImage';
import { toUpsertInput, type PostDraft } from '../lib/toUpsertInput';

/** 서버가 준 메시지를 그대로 보여주고, 정체 모를 오류만 기본 문구로 덮는다. */
const readMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : '요청에 실패했다';
};

/** 글 편집 화면의 상태와 저장·삭제·이미지 삽입을 한데 묶는다. initial이 없으면 새 글이다. */
export const usePostEditor = (initial?: { id: string; draft: PostDraft }) => {
  const router = useRouter();
  const [draft, setDraft] = useState<PostDraft>(
    initial?.draft ?? {
      title: '',
      slug: '',
      description: '',
      tags: [],
      publishedAt: '',
      contentMarkdown: '',
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const setField = <K extends keyof PostDraft>(
    key: K,
    value: PostDraft[K]
  ): void => {
    setDraft((current) => {
      return { ...current, [key]: value };
    });
  };

  /** 저장·삭제가 끝나면 돌려받은 주소로 옮겨 간다. */
  const run = async (action: () => Promise<string>) => {
    setPending(true);
    setError(null);

    try {
      const destination = await action();

      router.push(destination);
      // 방금 쓴 글은 아직 캐시에 없어서 서버 컴포넌트를 다시 읽혀야 보인다
      router.refresh();
    } catch (caught) {
      setError(readMessage(caught));
    } finally {
      setPending(false);
    }
  };

  const save = async () => {
    await run(async () => {
      const post = await savePost(
        toUpsertInput(draft, new Date().toISOString()),
        initial?.id
      );

      return `/blog/${post.slug}`;
    });
  };

  const remove = async () => {
    if (!initial) {
      return;
    }

    await run(async () => {
      await deletePost(initial.id);

      return '/blog';
    });
  };

  const insertImage = async (file: File, at: number) => {
    setPending(true);
    setError(null);

    try {
      const url = await uploadPostImage(file);
      // 앞뒤 줄바꿈이 있어야 문단 한가운데 끼어도 이미지가 제 줄에 선다
      const snippet = `\n![${file.name}](${url})\n`;

      setDraft((current) => {
        return {
          ...current,
          contentMarkdown:
            current.contentMarkdown.slice(0, at) +
            snippet +
            current.contentMarkdown.slice(at),
        };
      });
    } catch (caught) {
      setError(readMessage(caught));
    } finally {
      setPending(false);
    }
  };

  return {
    draft,
    setField,
    error,
    pending,
    save,
    remove,
    insertImage,
    isEditing: Boolean(initial),
  };
};
