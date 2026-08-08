import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminTag } from '@/entities/tag';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '../_lib/adminGuard';
import { POST } from './route';

vi.mock('../_lib/adminGuard', () => {
  return { requireAdmin: vi.fn(), mapWriteError: vi.fn() };
});

vi.mock('@/entities/tag', () => {
  return {
    createAdminTag: vi.fn(),
    getTags: vi.fn(),
    normalizeTagName: (name: string) => {
      return name.trim();
    },
  };
});

const tag = { id: 'tag-a', name: 'React', created_at: '2026-08-08T00:00:00Z' };

const postRequest = (body: unknown) => {
  return new Request('https://limjaejoon.com/api/admin/tags', {
    body: JSON.stringify(body),
    method: 'POST',
  });
};

const allowAdmin = () => {
  vi.mocked(requireAdmin).mockResolvedValue({
    client: {} as never,
    error: null,
  });
};

describe('POST /api/admin/tags', () => {
  beforeEach(() => {
    vi.mocked(requireAdmin).mockReset();
    vi.mocked(mapWriteError).mockReset();
    vi.mocked(createAdminTag).mockReset();
  });

  it('가드가 막으면 그 응답을 그대로 내고 write 를 실행하지 않는다', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      client: null,
      error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    });

    const response = await POST(postRequest({ name: 'React' }));

    expect(response.status).toBe(403);
    expect(createAdminTag).not.toHaveBeenCalled();
  });

  it('이름이 공백뿐이면 400 으로 막는다', async () => {
    allowAdmin();

    const response = await POST(postRequest({ name: '   ' }));

    expect(response.status).toBe(400);
    expect(createAdminTag).not.toHaveBeenCalled();
  });

  it('이름이 없으면 400 으로 막는다', async () => {
    allowAdmin();

    const response = await POST(postRequest({}));

    expect(response.status).toBe(400);
    expect(createAdminTag).not.toHaveBeenCalled();
  });

  it('만들어진 태그를 201 로 돌려준다', async () => {
    allowAdmin();
    vi.mocked(createAdminTag).mockResolvedValue(tag);

    const response = await POST(postRequest({ name: 'React' }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ tag });
  });

  it('중복 이름은 mapWriteError 결과를 그대로 반환한다', async () => {
    allowAdmin();
    vi.mocked(createAdminTag).mockRejectedValue({ code: '23505' });
    vi.mocked(mapWriteError).mockReturnValue(
      NextResponse.json({ message: 'Conflict' }, { status: 409 })
    );

    const response = await POST(postRequest({ name: 'React' }));

    expect(mapWriteError).toHaveBeenCalledWith({ code: '23505' });
    expect(response.status).toBe(409);
  });
});
