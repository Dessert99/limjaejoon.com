import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminPost } from '@/views/blog/server/adminPosts';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';
import { revalidatePublicPosts } from '@/views/blog/server/revalidate';
import { POST } from './route';

vi.mock('@/lib/auth/adminGuard', () => {
  return { requireAdmin: vi.fn(), mapWriteError: vi.fn() };
});

vi.mock('@/views/blog/server/revalidate', () => {
  return { revalidatePublicPosts: vi.fn() };
});

vi.mock('@/views/blog/server/adminPosts', () => {
  return { createAdminPost: vi.fn() };
});

const input = {
  title: '새 글',
  slug: 'new-post',
  description: '새 글 설명',
  tag_ids: ['tag-a'],
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 새 글',
};

const post = {
  id: '1',
  title: input.title,
  slug: input.slug,
  description: input.description,
  published_at: input.published_at,
  content_markdown: input.content_markdown,
  tags: ['Next.js'],
  created_at: '2026-07-09T00:00:00Z',
  updated_at: '2026-07-09T00:00:00Z',
};

const request = (body: unknown = input) => {
  return new Request('https://limjaejoon.com/api/admin/posts', {
    body: JSON.stringify(body),
    method: 'POST',
  });
};

describe('POST /api/admin/posts', () => {
  beforeEach(() => {
    vi.mocked(requireAdmin).mockReset();
    vi.mocked(mapWriteError).mockReset();
    vi.mocked(createAdminPost).mockReset();
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

    const response = await POST(request());

    expect(response.status).toBe(401);
    expect(createAdminPost).not.toHaveBeenCalled();
  });

  it('태그를 하나도 안 고르면 400 으로 막는다', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      client: {} as never,
      error: null,
    });

    const response = await POST(request({ ...input, tag_ids: [] }));

    expect(response.status).toBe(400);
    expect(createAdminPost).not.toHaveBeenCalled();
  });

  it('admin 세션이면 글을 생성한다', async () => {
    const client = { id: 'session-client' };
    vi.mocked(requireAdmin).mockResolvedValue({
      client: client as never,
      error: null,
    });
    vi.mocked(createAdminPost).mockResolvedValue(post);

    const response = await POST(request());

    expect(createAdminPost).toHaveBeenCalledWith(client, input);
    await expect(response.json()).resolves.toEqual({ post });
    expect(response.status).toBe(201);
    expect(revalidatePublicPosts).toHaveBeenCalled();
  });

  it('write 실패 시 mapWriteError 결과를 그대로 반환한다', async () => {
    const client = { id: 'session-client' };
    const mapped = NextResponse.json({ message: 'Conflict' }, { status: 409 });
    vi.mocked(requireAdmin).mockResolvedValue({
      client: client as never,
      error: null,
    });
    vi.mocked(createAdminPost).mockRejectedValue({ code: '23505' });
    vi.mocked(mapWriteError).mockReturnValue(mapped);

    const response = await POST(request());

    expect(mapWriteError).toHaveBeenCalledWith({ code: '23505' });
    expect(response.status).toBe(409);
  });
});
