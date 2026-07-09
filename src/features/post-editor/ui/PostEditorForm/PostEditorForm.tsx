'use client';

/** Markdown post editor form — CodeMirror 입력과 공개 renderer preview 를 묶는다 */
import { markdown } from '@codemirror/lang-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { useState, type FormEvent } from 'react';
import { PostMarkdown, type UpsertPostInput } from '@/entities/post/client';
import { uploadPostImage } from '../../api/uploadPostImage';
import {
  buildPostPayload,
  type PostEditorDraft,
  type PostEditorValue,
} from '../../model/usePostEditor';
import * as s from './PostEditorForm.css';

/** PostEditorForm props — create/edit API endpoint 를 mode 와 postId 로 결정한다 */
export type PostEditorFormProps = {
  initialValue: PostEditorValue;
  mode: 'create' | 'edit';
  postId?: string;
};

const toDraft = (value: PostEditorValue): PostEditorDraft => {
  return {
    ...value,
    tags: value.tags.join(', '),
    series: value.series ?? '',
  };
};

const readStoredToken = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.sessionStorage.getItem('adminPostToken') ?? '';
};

/** Markdown 글을 작성·수정하고 같은 renderer 로 preview 한다 */
export function PostEditorForm({
  initialValue,
  mode,
  postId,
}: PostEditorFormProps) {
  const [value, setValue] = useState<PostEditorDraft>(() => {
    return toDraft(initialValue);
  });
  const [token, setToken] = useState(readStoredToken);
  const [status, setStatus] = useState('');

  const updateField = <Key extends keyof PostEditorDraft>(
    field: Key,
    nextValue: PostEditorDraft[Key]
  ) => {
    setValue((current) => {
      return { ...current, [field]: nextValue };
    });
  };

  const updateToken = (nextToken: string) => {
    setToken(nextToken);

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('adminPostToken', nextToken);
    }
  };

  const insertImageMarkdown = (url: string) => {
    const current = value.content_markdown.trimEnd();
    const imageMarkdown = `![image](${url})`;

    updateField(
      'content_markdown',
      current ? `${current}\n\n${imageMarkdown}` : imageMarkdown
    );
  };

  const uploadImage = async (file: File) => {
    setStatus('이미지 업로드 중');

    try {
      const result = await uploadPostImage(file, token);
      insertImageMarkdown(result.url);
      setStatus('이미지 추가됨');
    } catch {
      setStatus('이미지 업로드 실패');
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('저장 중');

    const payload: UpsertPostInput = buildPostPayload(value);
    const endpoint =
      mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${postId}`;
    const response = await fetch(endpoint, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: {
        'content-type': 'application/json',
        'x-admin-post-token': token,
      },
      body: JSON.stringify(payload),
    });

    setStatus(response.ok ? '저장됨' : '저장 실패');
  };

  return (
    <form
      className={s.root}
      onSubmit={submit}>
      <div className={s.grid}>
        <label className={s.field}>
          <span className={s.label}>제목</span>
          <input
            className={s.control}
            onChange={(event) => {
              updateField('title', event.currentTarget.value);
            }}
            value={value.title}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>Slug</span>
          <input
            className={s.control}
            onChange={(event) => {
              updateField('slug', event.currentTarget.value);
            }}
            value={value.slug}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>설명</span>
          <input
            className={s.control}
            onChange={(event) => {
              updateField('description', event.currentTarget.value);
            }}
            value={value.description}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>카테고리</span>
          <input
            className={s.control}
            onChange={(event) => {
              updateField('category', event.currentTarget.value);
            }}
            value={value.category}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>시리즈</span>
          <input
            className={s.control}
            onChange={(event) => {
              updateField('series', event.currentTarget.value);
            }}
            value={value.series}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>태그</span>
          <input
            className={s.control}
            onChange={(event) => {
              updateField('tags', event.currentTarget.value);
            }}
            value={value.tags}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>상태</span>
          <select
            className={s.control}
            onChange={(event) => {
              updateField(
                'status',
                event.currentTarget.value as PostEditorDraft['status']
              );
            }}
            value={value.status}>
            <option value='draft'>draft</option>
            <option value='published'>published</option>
          </select>
        </label>

        <label className={s.field}>
          <span className={s.label}>발행일</span>
          <input
            className={s.control}
            onChange={(event) => {
              updateField('published_at', event.currentTarget.value || null);
            }}
            type='text'
            value={value.published_at ?? ''}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>Admin token</span>
          <input
            className={s.control}
            onChange={(event) => {
              updateToken(event.currentTarget.value);
            }}
            type='password'
            value={token}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>이미지</span>
          <input
            accept='image/*'
            className={s.control}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];

              if (file) {
                void uploadImage(file);
              }
            }}
            type='file'
          />
        </label>
      </div>

      <div className={s.field}>
        <span className={s.label}>본문</span>
        <div className={s.editor}>
          <CodeMirror
            extensions={[markdown()]}
            onChange={(nextValue) => {
              updateField('content_markdown', nextValue);
            }}
            value={value.content_markdown}
          />
        </div>
      </div>

      <section className={s.preview}>
        <h2>Preview</h2>
        <PostMarkdown source={value.content_markdown} />
      </section>

      <div className={s.actions}>
        <button
          className={s.submit}
          type='submit'>
          저장
        </button>
        {status ? (
          <span
            className={s.status}
            role='status'>
            {status}
          </span>
        ) : null}
      </div>
    </form>
  );
}
