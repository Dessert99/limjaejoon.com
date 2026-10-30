'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import type { Book } from '@/domains/books/types/book.types';
import {
  composeSlug,
  parseSlug,
  toPublishedAt,
} from '@/domains/posts/lib/postSlug';
import {
  type PostDraft,
  toUpsertInput,
} from '@/domains/posts/lib/toUpsertInput';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { PostMarkdown } from '@/domains/posts/ui/PostMarkdown';
import { SlugField } from '../SlugField/SlugField';
import { BookPicker } from '../BookPicker/BookPicker';
import { WritingGuide } from '../WritingGuide/WritingGuide';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/domains/posts/api/deletePost';
import { savePost } from '@/domains/posts/api/savePost';
import { uploadPostImage } from '@/domains/posts/api/uploadPostImage';
import { Field } from './Field';

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
const usePostEditor = (initial?: { id: string; draft: PostDraft }) => {
  const router = useRouter();
  const [draft, setDraft] = useState<PostDraft>(
    initial?.draft ?? {
      title: '',
      slug: '',
      description: '',
      kind: 'concept',
      bookId: '',
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

      return `/${draft.kind === 'story' ? 'experience' : 'blog'}/${post.slug}`;
    });
  };

  const remove = async () => {
    if (!initial) {
      return;
    }

    await run(async () => {
      await deletePost(initial.id);

      return '/library';
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

/** 붙여넣기·드롭에 딸려 온 것 중 이미지만 고른다. */
const imagesFrom = (files: FileList): File[] => {
  return Array.from(files).filter((file) => {
    return file.type.startsWith('image/');
  });
};

/** 오늘 날짜를 주소용 YYYY-MM-DD로 만든다. */
const today = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // toISOString은 UTC라 밤에 쓰면 어제가 된다. 로컬 날짜를 직접 조립한다
  return `${now.getFullYear()}-${month}-${day}`;
};

/** 글 작성·수정 화면. 위쪽은 메타 정보, 아래쪽은 본문 작성과 미리보기 탭이다. */
export function PostEditor({
  initial,
  books,
}: {
  initial?: { id: string; draft: PostDraft };
  books: Book[];
}) {
  const {
    draft,
    setField,
    error,
    pending,
    save,
    remove,
    insertImages,
    isEditing,
  } = usePostEditor(initial);
  const parsed = parseSlug(initial?.draft.slug ?? '');
  const [date, setDate] = useState(parsed.date || today());
  const [topic, setTopic] = useState(parsed.topic);

  // 날짜는 주소와 발행일 둘 다를 움직인다
  const changeDate = (next: string) => {
    setDate(next);
    setField('slug', composeSlug(next, topic));
    setField('publishedAt', toPublishedAt(next));
  };

  const changeTopic = (next: string) => {
    setTopic(next);
    setField('slug', composeSlug(date, next));
  };

  return (
    <main className='grow py-blog-section-sm'>
      <div className='mx-auto max-w-blog-wide px-blog-gutter'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <h1 className='text-3xl font-semibold'>
            {isEditing ? '글 수정' : '새 글'}
          </h1>

          <div className='flex flex-wrap items-center gap-3'>
            <Link
              href='/library'
              className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              블로그
            </Link>

            {isEditing ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={pending}>
                    삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>이 글을 지울까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      되돌릴 수 없다. 지운 뒤에는 같은 주소로 다시 만들어야
                      한다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        void remove();
                      }}>
                      지운다
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}

            <Button
              size='sm'
              disabled={pending}
              onClick={() => {
                void save();
              }}>
              {pending ? '저장 중…' : '저장'}
            </Button>
          </div>
        </div>

        {error ? (
          <p
            role='alert'
            className='mt-4 text-sm text-blog-destructive'>
            {error}
          </p>
        ) : null}

        <div className='mt-8'>
          <WritingGuide />
        </div>

        <div className='mt-8 grid gap-5 md:grid-cols-2'>
          <Field
            id='post-title'
            label='제목'
            value={draft.title}
            onChange={(value) => {
              setField('title', value);
            }}
          />

          <SlugField
            date={date}
            topic={topic}
            onDateChange={changeDate}
            onTopicChange={changeTopic}
          />

          <div className='md:col-span-2'>
            <Field
              id='post-description'
              label='설명'
              value={draft.description}
              onChange={(value) => {
                setField('description', value);
              }}
            />
          </div>

          <BookPicker
            books={books}
            kind={draft.kind}
            bookId={draft.bookId}
            onKindChange={(kind) => {
              setField('kind', kind);
            }}
            onBookChange={(id) => {
              setField('bookId', id);
            }}
          />
        </div>

        <Tabs
          defaultValue='write'
          className='mt-8'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <TabsList>
              <TabsTrigger value='write'>작성</TabsTrigger>
              <TabsTrigger value='preview'>미리보기</TabsTrigger>
            </TabsList>

            <p className='text-sm text-blog-muted-foreground'>
              이미지는 본문에 붙여넣거나 끌어다 놓는다
            </p>
          </div>

          <TabsContent value='write'>
            <Label
              htmlFor='post-body'
              className='sr-only'>
              본문 (Markdown)
            </Label>
            <Textarea
              id='post-body'
              value={draft.contentMarkdown}
              // 28줄은 한 화면에 꽉 차는 높이. 줄이면 긴 글에서 스크롤이 잦아진다
              rows={28}
              className='font-mono text-sm'
              onChange={(event) => {
                setField('contentMarkdown', event.target.value);
              }}
              onPaste={(event) => {
                const files = imagesFrom(event.clipboardData.files);

                // 이미지가 없으면 막지 않는다. 마크다운 문서 붙여넣기가 그대로 지나가야 한다
                if (files.length === 0) {
                  return;
                }

                event.preventDefault();
                void insertImages(files, event.currentTarget.selectionStart);
              }}
              onDrop={(event) => {
                const files = imagesFrom(event.dataTransfer.files);

                if (files.length === 0) {
                  return;
                }

                event.preventDefault();
                // 끄는 동안 브라우저가 캐럿을 옮겨둔다. 그 자리가 놓으려는 자리다
                void insertImages(files, event.currentTarget.selectionStart);
              }}
            />
          </TabsContent>

          <TabsContent value='preview'>
            <div className='rounded-lg border border-blog-border p-6'>
              {/* 실제 글과 같은 본문 폭이라야 미리보기에서 줄바꿈이 어긋나지 않는다 */}
              <div className='max-w-[48rem]'>
                <PostMarkdown markdown={draft.contentMarkdown} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
