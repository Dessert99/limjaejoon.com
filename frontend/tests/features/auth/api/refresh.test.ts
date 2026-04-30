// refresh API 단위 테스트 — body 없이 /auth/refresh 호출, 새 accessExpiresAt 기록
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/client', () => ({
  apiClient: { post: vi.fn() },
}));
vi.mock('@/lib/api/tokenStore', () => ({
  setAccessExpiresAt: vi.fn(),
}));

import { apiClient } from '@/lib/api/client';
import { setAccessExpiresAt } from '@/lib/api/tokenStore';
import { refresh } from '@/features/auth/api/refresh';

describe('refresh API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('apiClient.post를 /auth/refresh 경로로 호출한다 (refresh 토큰은 쿠키로 전송됨)', async () => {
    (apiClient.post as Mock).mockResolvedValue({
      data: { user: {}, accessExpiresAt: 0 },
    });

    await refresh();

    // body 없이 호출 — refresh 토큰은 httpOnly 쿠키로 자동 전송됨
    expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh');
  });

  it('성공 시 새 accessExpiresAt을 tokenStore에 기록한다', async () => {
    (apiClient.post as Mock).mockResolvedValue({
      data: { user: {}, accessExpiresAt: 1714200000000 },
    });

    await refresh();

    // 사전 refresh 타이머가 새 만료시각으로 재설정되어야 함
    expect(setAccessExpiresAt).toHaveBeenCalledWith(1714200000000);
  });

  it('응답 data를 그대로 반환한다', async () => {
    const mockResponse = {
      user: { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' },
      accessExpiresAt: 1714200000000,
    };
    (apiClient.post as Mock).mockResolvedValue({ data: mockResponse });

    const result = await refresh();

    expect(result).toEqual(mockResponse);
  });

  it('실패 시 setAccessExpiresAt을 호출하지 않고 에러를 throw한다', async () => {
    (apiClient.post as Mock).mockRejectedValue(new Error('refresh expired'));

    await expect(refresh()).rejects.toThrow('refresh expired');
    expect(setAccessExpiresAt).not.toHaveBeenCalled();
  });
});
