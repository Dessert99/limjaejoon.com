import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminPost } from '@/entities/post';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '../_lib/adminGuard';
import { revalidatePublicPosts } from '../_lib/revalidatePublicPosts';
import { POST } from './route';

vi.mock('../_lib/adminGuard', () => {
  return { requireAdmin: vi.fn(), mapWriteError: vi.fn() };
});

// 실제 revalidatePath 는 Next 요청 컨텍스트 밖에서 터진다
vi.mock('../_lib/revalidatePublicPosts', () => {
  return { revalidatePublicPosts: vi.fn() };
});

vi.mock('@/entities/post', () => {
  return { createAdminPost: vi.fn() };
});

const input = {
  title: '새 글',
  slug: 'new-post',
  description: '새 글 설명',
  tags: ['Next.js'],
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 새 글',
};

const post = {
  id: '1',
  ...input,
  created_at: '2026-07-09T00:00:00Z',
  updated_at: '2026-07-09T00:00:00Z',
};

const request = () => {
  return new Request('https://limjaejoon.com/api/admin/posts', {
    body: JSON.stringify(input),
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
    // 재검증이 빠지면 저장은 되는데 공개 목록에만 안 뜬다
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
