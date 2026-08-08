import { describe, expect, it, vi } from 'vitest';

const getUser = vi.fn();
vi.mock('@/shared/api', () => {
  return {
    createSupabaseServerClient: async () => {
      return { auth: { getUser } };
    },
  };
});

import { mapWriteError, requireAdmin } from './adminGuard';

const req = (origin: string | null, headers: Record<string, string> = {}) => {
  return new Request('https://internal-host:3000/api/admin/posts', {
    method: 'POST',
    headers: origin ? { origin, ...headers } : headers,
  });
};

describe('requireAdmin', () => {
  it('Origin 이 없으면 403 이다', async () => {
    const { error } = await requireAdmin(req(null, { host: 'limjaejoon.com' }));
    expect(error?.status).toBe(403);
  });

  it('Origin 이 파싱 불가능하면 403 이다', async () => {
    const { error } = await requireAdmin(
      req('null', { host: 'limjaejoon.com' })
    );
    expect(error?.status).toBe(403);
  });

  it('Origin 이 x-forwarded-host 와 다르면 403 이다', async () => {
    const { error } = await requireAdmin(
      req('https://evil.com', {
        host: 'internal-host:3000',
        'x-forwarded-host': 'limjaejoon.com',
      })
    );
    expect(error?.status).toBe(403);
  });

  it('Origin 이 request.url 의 내부 호스트와 달라도 x-forwarded-host 와 같으면 통과한다', async () => {
    getUser.mockResolvedValueOnce({
      data: { user: { id: '1', app_metadata: { role: 'admin' } } },
      error: null,
    });
    // request.url 은 내부 호스트(internal-host:3000)지만 프록시가 넘긴 공개 호스트는 limjaejoon.com
    const { error } = await requireAdmin(
      req('https://limjaejoon.com', {
        host: 'internal-host:3000',
        'x-forwarded-host': 'limjaejoon.com',
      })
    );
    expect(error).toBeNull();
  });

  it('x-forwarded-host 가 없으면 host 헤더와 비교한다', async () => {
    getUser.mockResolvedValueOnce({
      data: { user: { id: '1', app_metadata: { role: 'admin' } } },
      error: null,
    });
    const { error } = await requireAdmin(
      req('https://limjaejoon.com', { host: 'limjaejoon.com' })
    );
    expect(error).toBeNull();
  });

  it('getUser 가 에러를 반환하면 401 이다', async () => {
    getUser.mockResolvedValueOnce({
      data: { user: null },
      error: new Error('invalid token'),
    });
    const { error } = await requireAdmin(
      req('https://limjaejoon.com', { host: 'limjaejoon.com' })
    );
    expect(error?.status).toBe(401);
  });

  it('세션이 없으면 401 이다', async () => {
    getUser.mockResolvedValueOnce({ data: { user: null }, error: null });
    const { error } = await requireAdmin(
      req('https://limjaejoon.com', { host: 'limjaejoon.com' })
    );
    expect(error?.status).toBe(401);
  });

  it('admin 이 아니면 403 이다', async () => {
    getUser.mockResolvedValueOnce({
      data: { user: { id: '1', app_metadata: { role: 'user' } } },
      error: null,
    });
    const { error } = await requireAdmin(
      req('https://limjaejoon.com', { host: 'limjaejoon.com' })
    );
    expect(error?.status).toBe(403);
  });

  it('admin 이면 error 가 null 이고 client 가 있다', async () => {
    getUser.mockResolvedValueOnce({
      data: { user: { id: '1', app_metadata: { role: 'admin' } } },
      error: null,
    });
    const { error, client } = await requireAdmin(
      req('https://limjaejoon.com', { host: 'limjaejoon.com' })
    );
    expect(error).toBeNull();
    expect(client).toBeDefined();
  });
});

describe('mapWriteError', () => {
  it('unique_violation 은 409 다', () => {
    expect(mapWriteError({ code: '23505' }).status).toBe(409);
  });
  it('foreign_key_violation 은 409 다', () => {
    // 연결된 글이 있는 태그를 지우는 정상적인 거부다 — 500 이면 장애로 보인다
    expect(mapWriteError({ code: '23503' }).status).toBe(409);
  });
  it('RLS 거부(42501)는 403 이다', () => {
    expect(mapWriteError({ code: '42501' }).status).toBe(403);
  });
  it('그 외는 500 이다', () => {
    expect(mapWriteError(new Error('x')).status).toBe(500);
  });
});
