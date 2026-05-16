// getMe API 단위 테스트 — 가장 단순. 부수효과 없이 GET 후 data 반환만
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// tokenStore mock 필요 없음 — getMe는 부수효과 0
vi.mock('@/lib/api/client', () => {
  return {
    apiClient: { get: vi.fn() },
  };
});

import { apiClient } from '@/lib/api/client';
import { getMe } from '@/features/auth/api/getMe';

describe('getMe API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('apiClient.get을 /auth/me 경로로 호출한다', async () => {
    (apiClient.get as Mock).mockResolvedValue({
      data: { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' },
    });

    await getMe();

    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
  });

  it('응답 data(User)를 그대로 반환한다', async () => {
    const mockUser = { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' };
    (apiClient.get as Mock).mockResolvedValue({ data: mockUser });

    const result = await getMe();

    expect(result).toEqual(mockUser);
  });

  it('실패 시 에러를 그대로 throw한다 (401은 axios 인터셉터가 처리)', async () => {
    (apiClient.get as Mock).mockRejectedValue(new Error('401 Unauthorized'));

    await expect(getMe()).rejects.toThrow('401 Unauthorized');
  });
});
