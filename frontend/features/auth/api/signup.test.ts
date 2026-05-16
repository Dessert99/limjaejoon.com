// signup API 단위 테스트 — apiClient·tokenStore를 mock해 thin wrapper 동작만 검증
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// apiClient: axios 인스턴스 통째로 가짜로. 실제 네트워크 호출은 일어나면 안 됨
vi.mock('@/lib/api/client', () => {
  return {
    apiClient: { post: vi.fn() },
  };
});
// tokenStore: setAccessExpiresAt이 정확히 호출됐는지 추적용 mock
vi.mock('@/lib/api/tokenStore', () => {
  return {
    setAccessExpiresAt: vi.fn(),
  };
});

import { apiClient } from '@/lib/api/client';
import { setAccessExpiresAt } from '@/lib/api/tokenStore';
import { signup } from '@/features/auth/api/signup';

describe('signup API', () => {
  beforeEach(() => {
    // 매 테스트 전 mock 호출 이력 초기화
    vi.clearAllMocks();
  });

  it('성공 응답이면 응답 data를 그대로 반환한다', async () => {
    // Arrange — 백엔드가 user + accessExpiresAt 반환했다고 흉내
    const mockResponse = {
      user: { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' },
      accessExpiresAt: 1714099200000,
    };
    (apiClient.post as Mock).mockResolvedValue({ data: mockResponse });

    // Act
    const result = await signup({ email: 'a@b.c', password: 'pw12345678' });

    // Assert — 응답이 그대로 반환되는지
    expect(result).toEqual(mockResponse);
  });

  it('apiClient.post를 /auth/signup 경로와 body로 호출한다', async () => {
    (apiClient.post as Mock).mockResolvedValue({
      data: { user: {}, accessExpiresAt: 0 },
    });

    const body = { email: 'a@b.c', password: 'pw12345678' };
    await signup(body);

    // toHaveBeenCalledWith — 함수가 어떤 인자로 호출됐는지 검증
    expect(apiClient.post).toHaveBeenCalledWith('/auth/signup', body);
  });

  it('성공 시 setAccessExpiresAt에 응답의 accessExpiresAt을 전달한다', async () => {
    (apiClient.post as Mock).mockResolvedValue({
      data: { user: {}, accessExpiresAt: 1714099200000 },
    });

    await signup({ email: 'a@b.c', password: 'pw12345678' });

    // 사전 refresh 타이머가 동작하려면 만료시각이 tokenStore에 기록돼야 함
    expect(setAccessExpiresAt).toHaveBeenCalledWith(1714099200000);
  });

  it('실패하면 setAccessExpiresAt을 호출하지 않고 에러를 그대로 throw한다', async () => {
    // Arrange — apiClient.post가 reject (실제 axios 에러 흉내)
    const error = new Error('Network error');
    (apiClient.post as Mock).mockRejectedValue(error);

    // Act + Assert — 에러는 그대로 전파되어야 함 (try/catch 없음 = 호출부가 처리)
    await expect(
      signup({ email: 'a@b.c', password: 'pw12345678' })
    ).rejects.toThrow('Network error');

    // 실패 시 만료시각 기록은 절대 일어나면 안 됨
    expect(setAccessExpiresAt).not.toHaveBeenCalled();
  });
});
