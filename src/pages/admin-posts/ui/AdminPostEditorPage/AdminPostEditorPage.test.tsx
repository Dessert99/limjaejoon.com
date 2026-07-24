import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PostEditorForm } from '@/features/post-editor';
import { AdminPostEditorPage } from './AdminPostEditorPage';

vi.mock('@/features/post-editor', () => {
  return {
    PostEditorForm: vi.fn(({ mode, postId }) => {
      return (
        <div data-testid='post-editor-form'>
          {mode}
          {postId ? `:${postId}` : ''}
        </div>
      );
    }),
  };
});

describe('AdminPostEditorPage', () => {
  it('새 글 작성 editor 를 렌더한다', () => {
    render(<AdminPostEditorPage mode='create' />);

    expect(screen.getByTestId('post-editor-form')).toHaveTextContent('create');
    expect(PostEditorForm).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'create' }),
      undefined
    );
  });

  it('기존 글 수정 editor 를 렌더한다', () => {
    render(
      <AdminPostEditorPage
        mode='edit'
        postId='1'
      />
    );

    expect(screen.getByTestId('post-editor-form')).toHaveTextContent('edit:1');
  });
});
