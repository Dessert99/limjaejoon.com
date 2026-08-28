'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { deletePost } from './deletePost';
import { savePost } from './savePost';
import { uploadPostImage } from './uploadPostImage';
import { toUpsertInput, type PostDraft } from '../lib/toUpsertInput';

/** 서버가 준 메시지를 그대로 보여주고, 정체 모를 오류만 기본 문구로 덮는다. */
const readMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : '요청에 실패했다';
};

/** 클립보드 캡처는 죄다 image.png라, 나중에 어느 글 것인지 알아보게 슬러그로 새로 짓는다. */
const imageName = (slug: string, seq: number): string => {
  // 슬러그에 남는 한글은 버킷 경로에서 인코딩돼 읽기 힘들어진다
  const base = slug.replace(/[^a-z0-9-]/gi, '') || 'post';

  return `${base}-${seq}`;
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
  const [uploads, setUploads] = useState(0);
  const seq = useRef(0);

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

  /** 토큰이 있던 자리를 결과로 갈아 끼운다. */
  const replaceToken = (token: string, snippet: string) => {
    setDraft((current) => {
      return {
        ...current,
        contentMarkdown: current.contentMarkdown.replace(token, snippet),
      };
    });
  };

  const insertImages = async (files: File[], at: number) => {
    const items = files.map((file) => {
      seq.current += 1;

      return {
        file,
        name: imageName(draft.slug, seq.current),
        // 커서로 되짚으면 올리는 동안 타이핑했을 때 자리가 밀린다. 토큰으로 되찾는다
        token: `<!-- 올리는 중 ${seq.current} -->`,
      };
    });

    setDraft((current) => {
      const tokens = items
        .map((item) => {
          return item.token;
        })
        .join('\n');

      return {
        ...current,
        // 앞뒤 줄바꿈이 있어야 문단 한가운데 끼어도 이미지가 제 줄에 선다
        contentMarkdown:
          current.contentMarkdown.slice(0, at) +
          `\n${tokens}\n` +
          current.contentMarkdown.slice(at),
      };
    });

    setError(null);
    setUploads((count) => {
      return count + items.length;
    });

    await Promise.all(
      items.map(async (item) => {
        try {
          const url = await uploadPostImage(item.file, item.name);

          replaceToken(item.token, `<img src="${url}" alt="" />`);
        } catch (caught) {
          // 실패한 자리를 비워야 본문에 주석만 남지 않는다
          replaceToken(item.token, '');
          setError(readMessage(caught));
        } finally {
          setUploads((count) => {
            return count - 1;
          });
        }
      })
    );
  };

  return {
    draft,
    setField,
    error,
    // 올리는 중에 저장하면 본문에 토큰이 그대로 굳는다
    pending: pending || uploads > 0,
    save,
    remove,
    insertImages,
    isEditing: Boolean(initial),
  };
};
