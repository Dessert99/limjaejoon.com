import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteAdminTag, updateAdminTag } from '@/views/blog/server/adminTags';
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

vi.mock('@/views/blog/server/adminTags', () => {
  return {
    deleteAdminTag: vi.fn(),
    updateAdminTag: vi.fn(),
    normalizeTagName: (name: string) => {
      return name.trim();
    },
  };
});

const tag = { id: 'tag-a', name: 'React', created_at: '2026-08-08T00:00:00Z' };

const context = { params: Promise.resolve({ id: 'tag-a' }) };

const patchRequest = (body: unknown) => {
  return new Request('https://limjaejoon.com/api/admin/tags/tag-a', {
    body: JSON.stringify(body),
    method: 'PATCH',
  });
};

const deleteRequest = () => {
  return new Request('https://limjaejoon.com/api/admin/tags/tag-a', {
    method: 'DELETE',
  });
};

const allowAdmin = () => {
  vi.mocked(requireAdmin).mockResolvedValue({
    client: {} as never,
    error: null,
  });
};

describe('PATCH /api/admin/tags/[id]', () => {
  beforeEach(() => {
    vi.mocked(requireAdmin).mockReset();
    vi.mocked(mapWriteError).mockReset();
    vi.mocked(updateAdminTag).mockReset();
    vi.mocked(revalidatePublicPosts).mockReset();
  });

  it('가드가 막으면 그 응답을 그대로 내고 write 를 실행하지 않는다', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      client: null,
      error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    });

    const response = await PATCH(patchRequest({ name: 'React' }), context);

    expect(response.status).toBe(403);
    expect(updateAdminTag).not.toHaveBeenCalled();
  });

  it('이름이 공백뿐이면 400 으로 막는다', async () => {
    allowAdmin();

    const response = await PATCH(patchRequest({ name: '   ' }), context);

    expect(response.status).toBe(400);
    expect(updateAdminTag).not.toHaveBeenCalled();
  });

  it('이름을 고치면 공개 화면을 다시 굽는다', async () => {
    allowAdmin();
    vi.mocked(updateAdminTag).mockResolvedValue(tag);

    const response = await PATCH(patchRequest({ name: 'React' }), context);

    expect(response.status).toBe(200);
    expect(revalidatePublicPosts).toHaveBeenCalled();
  });

  it('없는 id 면 404 를 내고 재검증하지 않는다', async () => {
    allowAdmin();
    vi.mocked(updateAdminTag).mockResolvedValue(null);

    const response = await PATCH(patchRequest({ name: 'React' }), context);

    expect(response.status).toBe(404);
    expect(revalidatePublicPosts).not.toHaveBeenCalled();
  });

  it('중복 이름은 mapWriteError 결과를 그대로 반환한다', async () => {
    allowAdmin();
    vi.mocked(updateAdminTag).mockRejectedValue({ code: '23505' });
    vi.mocked(mapWriteError).mockReturnValue(
      NextResponse.json({ message: 'Conflict' }, { status: 409 })
    );

    const response = await PATCH(patchRequest({ name: 'React' }), context);

    expect(mapWriteError).toHaveBeenCalledWith({ code: '23505' });
    expect(response.status).toBe(409);
  });
});

describe('DELETE /api/admin/tags/[id]', () => {
  beforeEach(() => {
    vi.mocked(requireAdmin).mockReset();
    vi.mocked(mapWriteError).mockReset();
    vi.mocked(deleteAdminTag).mockReset();
    vi.mocked(revalidatePublicPosts).mockReset();
  });

  it('연결된 글이 없으면 지우고 204 를 낸다', async () => {
    allowAdmin();
    vi.mocked(deleteAdminTag).mockResolvedValue(true);

    const response = await DELETE(deleteRequest(), context);

    expect(response.status).toBe(204);
    expect(revalidatePublicPosts).not.toHaveBeenCalled();
  });

  it('연결된 글이 있으면 FK 거부를 409 로 옮긴다', async () => {
    allowAdmin();
    vi.mocked(deleteAdminTag).mockRejectedValue({ code: '23503' });
    vi.mocked(mapWriteError).mockReturnValue(
      NextResponse.json({ message: 'Conflict' }, { status: 409 })
    );

    const response = await DELETE(deleteRequest(), context);

    expect(mapWriteError).toHaveBeenCalledWith({ code: '23503' });
    expect(response.status).toBe(409);
  });

  it('없는 id 면 404 를 낸다', async () => {
    allowAdmin();
    vi.mocked(deleteAdminTag).mockResolvedValue(false);

    const response = await DELETE(deleteRequest(), context);

    expect(response.status).toBe(404);
  });
});
