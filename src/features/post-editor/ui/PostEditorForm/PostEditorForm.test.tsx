import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PostEditorForm } from './PostEditorForm';

vi.mock('@uiw/react-codemirror', () => {
  return {
    default: ({ value }: { value: string }) => {
      return (
        <textarea
          aria-label='본문'
          readOnly
          value={value}
        />
      );
    },
  };
});

const initialValue = {
  title: '새 글',
  slug: 'new-post',
  description: '새 글 설명',
  category: 'frontend',
  series: null,
  tags: ['Next.js'],
  status: 'draft' as const,
  published_at: null,
  content_markdown: '# 새 글',
};

describe('PostEditorForm', () => {
  it('글 저장에 필요한 editor controls 를 렌더한다', () => {
    render(
      <PostEditorForm
        initialValue={initialValue}
        mode='create'
      />
    );

    expect(screen.getByLabelText('제목')).toBeInTheDocument();
    expect(screen.getByLabelText('Slug')).toBeInTheDocument();
    expect(screen.getByLabelText('본문')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
  });
});
