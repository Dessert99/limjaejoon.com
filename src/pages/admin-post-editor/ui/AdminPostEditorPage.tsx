'use client';

/** 글 편집 — 신규와 수정이 같은 폼을 쓴다(차이는 초기값과 저장 대상뿐이다) */
import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  composeSlug,
  parseSlug,
  toPublishedAt,
  usePostEditor,
  type PostDraft,
} from '@/features/manage-post';
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
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  buttonVariants,
} from '@/shared/ui';
import { MarkdownPreview } from './MarkdownPreview/MarkdownPreview';
import { SlugField } from './SlugField/SlugField';

/** 오늘 — 새 글의 기본 날짜 */
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

export function AdminPostEditorPage({
  initial,
}: {
  initial?: { id: string; draft: PostDraft };
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

  // 친 그대로를 들고 있는다 — slug 에서 되읽으면 눕히는 규칙 탓에 공백을 칠 수 없다
  const parsed = parseSlug(initial?.draft.slug ?? '');
  const [date, setDate] = useState(parsed.date || today());
  const [topic, setTopic] = useState(parsed.topic);

  const changeDate = (next: string) => {
    setDate(next);
    setField('slug', composeSlug(next, topic));
    // 날짜 하나가 주소와 발행일을 함께 정한다 — 입력이 둘이면 어긋난 채 저장될 수 있다
    setField('publishedAt', toPublishedAt(next));
  };

  const changeTopic = (next: string) => {
    setTopic(next);
    setField('slug', composeSlug(date, next));
  };

  return (
    <main className='grow py-section-sm'>
      <div className='mx-auto max-w-wide px-gutter'>
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

        {/* 실패는 화면에 머문다 — 원인은 서버 문구를 그대로 보여준다(운영자 본인만 보는 화면) */}
        {error ? (
          <p
            role='alert'
            className='mt-4 text-body-sm text-destructive'>
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

          <Field
            id='post-series'
            label='시리즈 (없으면 비운다)'
            value={draft.series}
            onChange={(value) => {
              setField('series', value);
            }}
          />

          <Field
            id='post-tags'
            label='태그 (쉼표로 구분)'
            value={draft.tags}
            onChange={(value) => {
              setField('tags', value);
            }}
            placeholder='React, hydration'
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
                className='text-muted-foreground'>
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

                  // 업로드 URL 은 본문 커서 자리에 꽂는다 — 끝에 붙이면 긴 글에서 매번 찾아 옮겨야 한다
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
              className='font-mono text-body-sm'
              onChange={(event) => {
                setField('contentMarkdown', event.target.value);
              }}
            />
          </TabsContent>

          {/* 공개 화면과 같은 폭으로 그린다 — 여기서 좁으면 줄바꿈이 실제와 달라 보인다 */}
          <TabsContent value='preview'>
            <div className='rounded-md border border-border p-6'>
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
