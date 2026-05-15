// login API 단위 테스트 — signup과 거의 동일한 패턴 (auto-login 구조)
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/client', () => {
  return {
    apiClient: { post: vi.fn() },
  };
});
vi.mock('@/lib/api/tokenStore', () => {
  return {
    setAccessExpiresAt: vi.fn(),
  };
});

import { apiClient } from '@/lib/api/client';
import { setAccessExpiresAt } from '@/lib/api/tokenStore';
import { login } from '@/features/auth/api/login';

describe('login API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('apiClient.post를 /auth/login 경로와 body로 호출한다', async () => {
    (apiClient.post as Mock).mockResolvedValue({
      data: { user: {}, accessExpiresAt: 0 },
    });

    const body = { email: 'a@b.c', password: 'pw12345678' };
    await login(body);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', body);
  });

  it('성공 시 응답의 accessExpiresAt을 tokenStore에 기록한다', async () => {
    (apiClient.post as Mock).mockResolvedValue({
      data: { user: {}, accessExpiresAt: 1714099200000 },
    });

    await login({ email: 'a@b.c', password: 'pw12345678' });

    expect(setAccessExpiresAt).toHaveBeenCalledWith(1714099200000);
  });

  it('성공 응답의 data를 그대로 반환한다', async () => {
    const mockResponse = {
      user: { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' },
      accessExpiresAt: 1714099200000,
    };
    (apiClient.post as Mock).mockResolvedValue({ data: mockResponse });

    const result = await login({ email: 'a@b.c', password: 'pw12345678' });

    expect(result).toEqual(mockResponse);
  });

  it('실패 시 setAccessExpiresAt을 호출하지 않고 에러를 throw한다', async () => {
    (apiClient.post as Mock).mockRejectedValue(new Error('401 Unauthorized'));

    await expect(
      login({ email: 'a@b.c', password: 'wrongpass' })
    ).rejects.toThrow('401 Unauthorized');

    expect(setAccessExpiresAt).not.toHaveBeenCalled();
  });
});
