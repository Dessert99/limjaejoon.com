'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { TagWithUsage } from '../../../lib/tag.types';
import { composeSlug, parseSlug, toPublishedAt } from '../../lib/postSlug';
import { type PostDraft } from '../../lib/toUpsertInput';
import { usePostEditor } from '../../lib/usePostEditor';
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
} from '@/views/blog/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/views/blog/components/ui/button';
import { Input } from '@/views/blog/components/ui/input';
import { Label } from '@/views/blog/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/views/blog/components/ui/tabs';
import { Textarea } from '@/views/blog/components/ui/textarea';
import { MarkdownPreview } from '../MarkdownPreview/MarkdownPreview';
import { SlugField } from '../SlugField/SlugField';
import { TagPicker } from '../TagPicker/TagPicker';

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

/** 라벨 붙은 한 줄 입력칸. 제목·설명처럼 단순한 필드가 쓴다. */
function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className='flex flex-col gap-2'>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}

/** 글 작성·수정 화면. 위쪽은 메타 정보, 아래쪽은 본문 작성과 미리보기 탭이다. */
export function PostEditor({
  initial,
  tags: initialTags,
}: {
  initial?: { id: string; draft: PostDraft };
  tags: TagWithUsage[];
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
  const [tags, setTags] = useState(initialTags);

  // 관리 대화상자에서 태그가 지워지면 이 글에 남은 선택도 같이 떨어내야 한다
  const changeTags = (next: TagWithUsage[]) => {
    setTags(next);

    const alive = new Set(
      next.map((tag) => {
        return tag.id;
      })
    );

    setField(
      'tags',
      draft.tags.filter((id) => {
        return alive.has(id);
      })
    );
  };

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
              href='/blog'
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

          <TagPicker
            tags={tags}
            selected={draft.tags}
            onSelectedChange={(ids) => {
              setField('tags', ids);
            }}
            onTagsChange={changeTags}
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
                <MarkdownPreview markdown={draft.contentMarkdown} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
