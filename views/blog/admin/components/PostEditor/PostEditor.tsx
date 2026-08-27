'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
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

const today = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${now.getFullYear()}-${month}-${day}`;
};

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
    insertImage,
    isEditing,
  } = usePostEditor(initial);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [tags, setTags] = useState(initialTags);

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

            <div className='flex items-center gap-2'>
              <Label
                htmlFor='post-image'
                className='text-blog-muted-foreground'>
                이미지 삽입
              </Label>
              <Input
                id='post-image'
                type='file'
                accept='image/jpeg,image/png,image/webp,image/avif'
                disabled={pending}
                className='w-auto'
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  void insertImage(
                    file,
                    bodyRef.current?.selectionStart ??
                      draft.contentMarkdown.length
                  );
                  event.target.value = '';
                }}
              />
            </div>
          </div>

          <TabsContent value='write'>
            <Label
              htmlFor='post-body'
              className='sr-only'>
              본문 (Markdown)
            </Label>
            <Textarea
              id='post-body'
              ref={bodyRef}
              value={draft.contentMarkdown}
              rows={28}
              className='font-mono text-sm'
              onChange={(event) => {
                setField('contentMarkdown', event.target.value);
              }}
            />
          </TabsContent>

          <TabsContent value='preview'>
            <div className='rounded-lg border border-blog-border p-6'>
              <div className='max-w-[54rem]'>
                <MarkdownPreview markdown={draft.contentMarkdown} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
