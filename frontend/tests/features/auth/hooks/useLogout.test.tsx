// useLogout hook 단위 테스트 — 성공 시 모든 query 캐시 제거(queryClient.clear())
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/auth/api/logout', () => {
  return {
    logout: vi.fn(),
  };
});

import { logout } from '@/features/auth/api/logout';
import { authKeys } from '@/features/auth/constants/keys';
import { useLogout } from '@/features/auth/hooks/useLogout';

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  return { queryClient, wrapper };
}

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mutate 호출 시 logout API를 호출한다 (인자 없음)', async () => {
    (logout as Mock).mockResolvedValue({ ok: true });

    const { wrapper } = setup();
    const { result } = renderHook(
      () => {
        return useLogout();
      },
      { wrapper }
    );

    result.current.mutate();
    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    expect(logout).toHaveBeenCalled();
  });

  it('성공 시 queryClient.clear()로 모든 캐시를 제거한다', async () => {
    (logout as Mock).mockResolvedValue({ ok: true });

    const { queryClient, wrapper } = setup();
    // 사전에 임의 캐시를 채워둠 — clear()로 사라지는지 확인
    queryClient.setQueryData(authKeys.me(), {
      id: 'u1',
      email: 'a@b.c',
      createdAt: '2026-01-01',
    });
    expect(queryClient.getQueryData(authKeys.me())).toBeDefined();

    const { result } = renderHook(
      () => {
        return useLogout();
      },
      { wrapper }
    );
    result.current.mutate();
    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    // 모든 query 캐시 제거 — 다른 사용자가 같은 브라우저에서 로그인할 때 잔존 데이터 0 보장
    expect(queryClient.getQueryData(authKeys.me())).toBeUndefined();
  });

  it('실패 시 캐시를 제거하지 않고 isError가 true가 된다', async () => {
    (logout as Mock).mockRejectedValue(new Error('Network error'));

    const { queryClient, wrapper } = setup();
    queryClient.setQueryData(authKeys.me(), { id: 'u1' });

    const { result } = renderHook(
      () => {
        return useLogout();
      },
      { wrapper }
    );
    result.current.mutate();
    await waitFor(() => {
      return expect(result.current.isError).toBe(true);
    });

    // 실패 시 캐시는 보존 — 사용자 상태 그대로 유지
    expect(queryClient.getQueryData(authKeys.me())).toEqual({ id: 'u1' });
  });
});
