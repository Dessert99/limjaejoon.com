import { describe, expect, it, vi } from 'vitest';

const getClaims = vi.fn();
vi.mock('@/shared/api', () => {
  return {
    createSupabaseServerClient: async () => {
      return { auth: { getClaims } };
    },
  };
});

import { mapWriteError, requireAdmin } from './adminGuard';

const req = (origin: string | null) => {
  return new Request('https://limjaejoon.com/api/admin/posts', {
    method: 'POST',
    headers: origin ? { origin } : {},
  });
};

describe('requireAdmin', () => {
  it('Origin 이 요청 호스트와 다르면 403 이다', async () => {
    const { error } = await requireAdmin(req('https://evil.com'));
    expect(error?.status).toBe(403);
  });

  it('세션이 없으면 401 이다', async () => {
    getClaims.mockResolvedValueOnce({ data: { claims: null }, error: null });
    const { error } = await requireAdmin(req('https://limjaejoon.com'));
    expect(error?.status).toBe(401);
  });

  it('admin 이 아니면 403 이다', async () => {
    getClaims.mockResolvedValueOnce({
      data: { claims: { sub: '1', app_metadata: { role: 'user' } } },
      error: null,
    });
    const { error } = await requireAdmin(req('https://limjaejoon.com'));
    expect(error?.status).toBe(403);
  });

  it('admin 이면 error 가 null 이다', async () => {
    getClaims.mockResolvedValueOnce({
      data: { claims: { sub: '1', app_metadata: { role: 'admin' } } },
      error: null,
    });
    const { error, client } = await requireAdmin(req('https://limjaejoon.com'));
    expect(error).toBeNull();
    expect(client).toBeDefined();
  });
});

describe('mapWriteError', () => {
  it('unique_violation 은 409 다', () => {
    expect(mapWriteError({ code: '23505' }).status).toBe(409);
  });
  it('RLS 거부(42501)는 403 이다', () => {
    expect(mapWriteError({ code: '42501' }).status).toBe(403);
  });
  it('그 외는 500 이다', () => {
    expect(mapWriteError(new Error('x')).status).toBe(500);
  });
});
