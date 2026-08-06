'use client';

/** 글 편집 — 신규와 수정이 같은 폼을 쓴다(차이는 초기값과 저장 대상뿐이다) */
import { useRef } from 'react';
import { usePostEditor, type PostDraft } from '@/features/manage-post';
import { Button, Container } from '@/shared/ui';
import { MarkdownPreview } from './MarkdownPreview/MarkdownPreview';

const FIELD_CLASS =
  'text-body w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground';

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
    <div className='flex flex-col gap-1'>
      <label
        htmlFor={id}
        className='text-body-sm text-muted'>
        {label}
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className={FIELD_CLASS}
      />
    </div>
  );
}

export function AdminPostEditorPage({
  initial,
}: {
  initial?: { id: string; draft: PostDraft };
}) {
  const { draft, setField, error, pending, save, insertImage, isEditing } =
    usePostEditor(initial);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background text-foreground'>
      <main className='grow py-section-sm'>
        <Container size='wide'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <h1 className='text-statement'>
              {isEditing ? '글 수정' : '새 글'}
            </h1>
            <div className='flex flex-wrap items-center gap-3'>
              {/* 삭제는 여기 없다 — 글 상세에서 한다(되돌릴 수 없는 동작의 자리를 하나로 둔다) */}
              <Button
                href='/blog'
                variant='outline'
                size='sm'>
                블로그
              </Button>
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
              className='mt-4 text-body-sm text-accent'>
              {error}
            </p>
          ) : null}

          <div className='mt-8 grid gap-8 lg:grid-cols-2'>
            <div className='flex flex-col gap-4'>
              <Field
                id='post-title'
                label='제목'
                value={draft.title}
                onChange={(value) => {
                  setField('title', value);
                }}
              />
              <Field
                id='post-slug'
                label='slug'
                value={draft.slug}
                onChange={(value) => {
                  setField('slug', value);
                }}
                placeholder='2026-08-06-my-post'
              />
              <Field
                id='post-description'
                label='설명'
                value={draft.description}
                onChange={(value) => {
                  setField('description', value);
                }}
              />
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
                placeholder='Next.js, Supabase'
              />

              <Field
                id='post-published-at'
                label='발행일 (비우면 저장 시각)'
                value={draft.publishedAt}
                onChange={(value) => {
                  setField('publishedAt', value);
                }}
                placeholder='2026-08-06T00:00:00.000Z'
              />

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='post-image'
                  className='text-body-sm text-muted'>
                  이미지 삽입
                </label>
                <input
                  id='post-image'
                  type='file'
                  accept='image/jpeg,image/png,image/webp,image/avif'
                  disabled={pending}
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
                  className='text-body-sm'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='post-body'
                  className='text-body-sm text-muted'>
                  본문 (Markdown)
                </label>
                <textarea
                  id='post-body'
                  ref={bodyRef}
                  value={draft.contentMarkdown}
                  onChange={(event) => {
                    setField('contentMarkdown', event.target.value);
                  }}
                  rows={24}
                  className={`${FIELD_CLASS} font-mono text-body-sm`}
                />
              </div>
            </div>

            <div className='lg:sticky lg:top-8 lg:max-h-svh lg:overflow-y-auto'>
              <p className='text-label text-subtle uppercase'>미리보기</p>
              <div className='mt-4 rounded-md border border-border p-6'>
                <MarkdownPreview markdown={draft.contentMarkdown} />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
