import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { uploadPostImage } from '../../api/uploadPostImage';
import { PostEditorForm } from './PostEditorForm';

vi.mock('@uiw/react-codemirror', () => {
  return {
    default: ({
      onChange,
      value,
    }: {
      onChange: (value: string) => void;
      value: string;
    }) => {
      return (
        <textarea
          aria-label='본문'
          onChange={(event) => {
            onChange(event.currentTarget.value);
          }}
          value={value}
        />
      );
    },
  };
});

vi.mock('../../api/uploadPostImage', () => {
  return { uploadPostImage: vi.fn() };
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

  it('업로드한 이미지 URL 을 Markdown 이미지 문법으로 본문에 삽입한다', async () => {
    const user = userEvent.setup();
    vi.mocked(uploadPostImage).mockResolvedValue({
      path: 'posts/image.png',
      url: 'https://cdn.example.com/image.png',
    });

    render(
      <PostEditorForm
        initialValue={initialValue}
        mode='create'
      />
    );

    await user.type(screen.getByLabelText('Admin token'), 'secret');
    await user.upload(
      screen.getByLabelText('이미지'),
      new File(['image'], 'image.png', { type: 'image/png' })
    );

    expect(uploadPostImage).toHaveBeenCalledWith(expect.any(File), 'secret');
    expect(screen.getByLabelText('본문')).toHaveValue(
      '# 새 글\n\n![image](https://cdn.example.com/image.png)'
    );
  });
});
