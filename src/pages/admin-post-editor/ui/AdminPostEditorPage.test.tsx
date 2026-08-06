/** AdminPostEditorPage 테스트 — 저장 대상 판별과 실패 노출을 검증한다 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_DRAFT } from '@/features/manage-post';
import { savePost } from '@/features/manage-post/api/savePost';
import { AdminPostEditorPage } from './AdminPostEditorPage';

vi.mock('next/navigation', () => {
  return {
    useRouter: () => {
      return { push: vi.fn(), refresh: vi.fn() };
    },
  };
});

vi.mock('@/features/manage-post/api/savePost', () => {
  return { savePost: vi.fn() };
});

const EXISTING = {
  id: 'post-1',
  draft: { ...EMPTY_DRAFT, title: '기존 글', slug: 'existing' },
};

describe('AdminPostEditorPage', () => {
  beforeEach(() => {
    vi.mocked(savePost).mockReset();
    vi.mocked(savePost).mockResolvedValue({ slug: 'saved' } as never);
  });

  it('새 글 저장은 대상 id 없이 보낸다', async () => {
    const user = userEvent.setup();

    render(<AdminPostEditorPage />);
    await user.type(screen.getByLabelText('제목'), '새 글');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(savePost).toHaveBeenCalledWith(
      expect.objectContaining({ title: '새 글' }),
      undefined
    );
  });

  it('수정 저장은 대상 id 와 함께 보낸다', async () => {
    const user = userEvent.setup();

    render(<AdminPostEditorPage initial={EXISTING} />);
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(savePost).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'existing' }),
      'post-1'
    );
  });

  it('발행일을 비워 두면 저장 시각이 실린다', async () => {
    const user = userEvent.setup();

    render(<AdminPostEditorPage initial={EXISTING} />);
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(savePost).toHaveBeenCalledWith(
      expect.objectContaining({ published_at: expect.any(String) }),
      'post-1'
    );
  });

  it('삭제 버튼은 두지 않는다 — 지우는 자리는 글 상세다', () => {
    render(<AdminPostEditorPage initial={EXISTING} />);

    expect(
      screen.queryByRole('button', { name: '삭제' })
    ).not.toBeInTheDocument();
  });

  it('저장에 실패하면 사유가 화면에 남는다', async () => {
    const user = userEvent.setup();
    vi.mocked(savePost).mockRejectedValue(new Error('HTTP 409: Conflict'));

    render(<AdminPostEditorPage initial={EXISTING} />);
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'HTTP 409: Conflict'
    );
  });
});
