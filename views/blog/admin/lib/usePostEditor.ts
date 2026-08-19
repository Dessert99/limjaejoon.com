'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deletePost } from './deletePost';
import { savePost } from './savePost';
import { uploadPostImage } from './uploadPostImage';
import {
  EMPTY_DRAFT,
  toUpsertInput,
  type PostDraft,
} from '../lib/toUpsertInput';

const readMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : '요청에 실패했다';
};

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
