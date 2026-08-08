'use client';

/** 글 편집 폼 상태 — plain state 로 관리한다(useSignIn 과 같은 방식, RHF 미사용) */
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deletePost } from '../api/deletePost';
import { savePost } from '../api/savePost';
import { uploadPostImage } from '../api/uploadPostImage';
import {
  EMPTY_DRAFT,
  toUpsertInput,
  type PostDraft,
} from '../lib/toUpsertInput';

const readMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : '요청에 실패했다';
};

/** 편집 대상이 있으면 수정, 없으면 새 글로 동작한다 */
export const usePostEditor = (initial?: { id: string; draft: PostDraft }) => {
  const router = useRouter();
  const [draft, setDraft] = useState<PostDraft>(initial?.draft ?? EMPTY_DRAFT);
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

  const run = async (action: () => Promise<string>) => {
    setPending(true);
    setError(null);

    try {
      const destination = await action();

      router.push(destination);
      // 목적지의 서버 컴포넌트가 방금 바뀐 내용을 다시 읽게 한다
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

      // 응답의 slug 를 쓴다 — 폼에 친 값이 아니라 서버가 실제로 저장한 값이다
      return `/blog/${post.slug}`;
    });
  };

  /** 글을 지운다 — 되돌릴 수 없어 호출 측이 확인 단계를 거친 뒤에만 부른다 */
  const remove = async () => {
    // 새 글에는 지울 대상이 없다
    if (!initial) {
      return;
    }

    await run(async () => {
      await deletePost(initial.id);

      return '/blog';
    });
  };

  /** 이미지를 올리고 본문 커서 자리에 Markdown 문법으로 끼운다 */
  const insertImage = async (file: File, at: number) => {
    setPending(true);
    setError(null);

    try {
      const url = await uploadPostImage(file);
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
