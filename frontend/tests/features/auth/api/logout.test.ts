// logout API 단위 테스트 — 성공 시 clearAuth 호출이 핵심 (signup·login과 다른 부수효과)
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/client', () => ({
  apiClient: { post: vi.fn() },
}));
// logout은 setAccessExpiresAt이 아니라 clearAuth를 호출함
vi.mock('@/lib/api/tokenStore', () => ({
  clearAuth: vi.fn(),
}));

import { apiClient } from '@/lib/api/client';
import { clearAuth } from '@/lib/api/tokenStore';
import { logout } from '@/features/auth/api/logout';

describe('logout API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('apiClient.post를 /auth/logout 경로로 호출한다 (body 없음)', async () => {
    (apiClient.post as Mock).mockResolvedValue({ data: { ok: true } });

    await logout();

    // logout은 body가 없음 — 두 번째 인자 미전달 또는 undefined
    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('성공 시 clearAuth로 tokenStore를 초기화한다', async () => {
    (apiClient.post as Mock).mockResolvedValue({ data: { ok: true } });

    await logout();

    // accessExpiresAt + refreshPromise mutex 모두 초기화 (다음 로그인 클린 상태 보장)
    expect(clearAuth).toHaveBeenCalled();
  });

  it('응답 data({ok})를 그대로 반환한다', async () => {
    (apiClient.post as Mock).mockResolvedValue({ data: { ok: true } });

    const result = await logout();

    expect(result).toEqual({ ok: true });
  });

  it('실패 시 clearAuth를 호출하지 않고 에러를 throw한다', async () => {
    (apiClient.post as Mock).mockRejectedValue(new Error('Network error'));

    await expect(logout()).rejects.toThrow('Network error');
    expect(clearAuth).not.toHaveBeenCalled();
  });
});
