// useMe hook 단위 테스트 — useQuery로 /auth/me 자동 조회
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/auth/api/getMe', () => ({
  getMe: vi.fn(),
}));

import { getMe } from '@/features/auth/api/getMe';
import { useMe } from '@/features/auth/hooks/useMe';

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

describe('useMe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('마운트 시 getMe API를 자동 호출한다 (useQuery 동작)', async () => {
    const mockUser = { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' };
    (getMe as Mock).mockResolvedValue(mockUser);

    const { wrapper } = setup();
    renderHook(() => useMe(), { wrapper });

    // useQuery는 마운트되자마자 queryFn을 호출 (mutation과 달리 manual trigger 불요)
    await waitFor(() => expect(getMe).toHaveBeenCalled());
  });

  it('성공 시 result.current.data에 user를 담아 반환한다', async () => {
    const mockUser = { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' };
    (getMe as Mock).mockResolvedValue(mockUser);

    const { wrapper } = setup();
    const { result } = renderHook(() => useMe(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUser);
  });

  it('실패 시 isError가 true가 된다', async () => {
    (getMe as Mock).mockRejectedValue(new Error('401 Unauthorized'));

    const { wrapper } = setup();
    const { result } = renderHook(() => useMe(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
