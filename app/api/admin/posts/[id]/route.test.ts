import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateAdminPost } from '@/entities/post';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '../../_lib/adminGuard';
import { PATCH } from './route';

vi.mock('../../_lib/adminGuard', () => {
  return { requireAdmin: vi.fn(), mapWriteError: vi.fn() };
});

vi.mock('@/entities/post', () => {
  return { updateAdminPost: vi.fn() };
});

const input = {
  title: '수정 글',
  slug: 'updated-post',
  description: '수정 글 설명',
  series: null,
  tags: ['Next.js'],
  status: 'published' as const,
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 수정 글',
};

const post = {
  id: '1',
  ...input,
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
