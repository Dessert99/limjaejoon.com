import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteAdminPost,
  updateAdminPost,
} from '@/views/blog/server/adminPosts';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';
import { revalidatePublicPosts } from '@/views/blog/server/revalidate';
import { DELETE, PATCH } from './route';

vi.mock('@/lib/auth/adminGuard', () => {
  return { requireAdmin: vi.fn(), mapWriteError: vi.fn() };
});

vi.mock('@/views/blog/server/revalidate', () => {
  return { revalidatePublicPosts: vi.fn() };
});

vi.mock('@/views/blog/server/adminPosts', () => {
  return { updateAdminPost: vi.fn(), deleteAdminPost: vi.fn() };
});

const input = {
  title: '수정 글',
  slug: 'updated-post',
  description: '수정 글 설명',
  tag_ids: ['tag-a'],
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 수정 글',
};

const post = {
  id: '1',
  ...input,
  tags: ['Next.js'],
  created_at: '2026-07-09T00:00:00Z',
  updated_at: '2026-07-09T00:00:00Z',
};

const request = () => {
  return new Request('https://limjaejoon.com/api/admin/posts/1', {
    body: JSON.stringify(input),
    method: 'PATCH',
  });
};

const context = { params: Promise.resolve({ id: '1' }) };

describe('PATCH /api/admin/posts/[id]', () => {
  beforeEach(() => {
    vi.mocked(requireAdmin).mockReset();
    vi.mocked(mapWriteError).mockReset();
    vi.mocked(updateAdminPost).mockReset();
    vi.mocked(deleteAdminPost).mockReset();
    vi.mocked(revalidatePublicPosts).mockReset();
  });

  it('가드가 막으면 그 응답을 그대로 내고 write 를 실행하지 않는다', async () => {
    const unauthorized = NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
    vi.mocked(requireAdmin).mockResolvedValue({
      client: null,
      error: unauthorized,
    });

    const response = await PATCH(request(), context);

    expect(response.status).toBe(401);
    expect(updateAdminPost).not.toHaveBeenCalled();
  });

  it('admin 세션이면 글을 수정한다', async () => {
    const client = { id: 'session-client' };
    vi.mocked(requireAdmin).mockResolvedValue({
      client: client as never,
      error: null,
    });
    vi.mocked(updateAdminPost).mockResolvedValue(post);

    const response = await PATCH(request(), context);

    expect(updateAdminPost).toHaveBeenCalledWith(client, '1', input);
    await expect(response.json()).resolves.toEqual({ post });
    expect(response.status).toBe(200);
    // 재검증이 빠지면 저장은 되는데 공개 화면만 옛 내용으로 남는다
    expect(revalidatePublicPosts).toHaveBeenCalled();
  });

  it('write 실패 시 mapWriteError 결과를 그대로 반환한다', async () => {
    const client = { id: 'session-client' };
    const mapped = NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    vi.mocked(requireAdmin).mockResolvedValue({
      client: client as never,
      error: null,
    });
    vi.mocked(updateAdminPost).mockRejectedValue({ code: '42501' });
    vi.mocked(mapWriteError).mockReturnValue(mapped);

    const response = await PATCH(request(), context);

    expect(mapWriteError).toHaveBeenCalledWith({ code: '42501' });
    expect(response.status).toBe(403);
  });
});

const deleteRequest = () => {
  return new Request('https://limjaejoon.com/api/admin/posts/1', {
    method: 'DELETE',
  });
};

describe('DELETE /api/admin/posts/[id]', () => {
  beforeEach(() => {
    vi.mocked(requireAdmin).mockReset();
    vi.mocked(mapWriteError).mockReset();
    vi.mocked(deleteAdminPost).mockReset();
    vi.mocked(revalidatePublicPosts).mockReset();
  });

  it('가드가 막으면 그 응답을 그대로 내고 삭제하지 않는다', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      client: null,
      error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    });

    const response = await DELETE(deleteRequest(), context);

    expect(response.status).toBe(403);
    expect(deleteAdminPost).not.toHaveBeenCalled();
  });

  it('admin 세션이면 글을 지우고 공개 화면을 재검증한다', async () => {
    const client = { id: 'session-client' };
    vi.mocked(requireAdmin).mockResolvedValue({
      client: client as never,
      error: null,
    });
    vi.mocked(deleteAdminPost).mockResolvedValue(true);

    const response = await DELETE(deleteRequest(), context);

    expect(deleteAdminPost).toHaveBeenCalledWith(client, '1');
    expect(response.status).toBe(204);
    expect(revalidatePublicPosts).toHaveBeenCalled();
  });

  it('지울 글이 없으면 404 를 내고 재검증하지 않는다', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      client: { id: 'session-client' } as never,
      error: null,
    });
    vi.mocked(deleteAdminPost).mockResolvedValue(false);

    const response = await DELETE(deleteRequest(), context);

    expect(response.status).toBe(404);
    expect(revalidatePublicPosts).not.toHaveBeenCalled();
  });
});
