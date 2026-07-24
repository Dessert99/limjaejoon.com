import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminPostsPage } from './AdminPostsPage';

describe('AdminPostsPage', () => {
  it('admin 글 목록 진입과 새 글 링크를 렌더한다', () => {
    render(<AdminPostsPage />);

    expect(
      screen.getByRole('heading', { name: '게시글 관리' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '새 글' })).toHaveAttribute(
      'href',
      '/admin/posts/new'
    );
  });
});
