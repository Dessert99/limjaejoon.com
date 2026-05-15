// useLoginMutate hook 단위 테스트 — useSignupMutate와 동일한 mutation + me 캐시 갱신 패턴
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/auth/api/login', () => {
  return {
    login: vi.fn(),
  };
});

import { login } from '@/features/auth/api/login';
import { authKeys } from '@/features/auth/constants/authkeys';
import { useLoginMutate } from '@/features/auth/hooks/mutations/useLoginMutate';

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

describe('useLoginMutate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mutate 호출 시 login API를 동일 인자로 호출한다', async () => {
    (login as Mock).mockResolvedValue({
      user: { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' },
      accessExpiresAt: 0,
    });

    const { wrapper } = setup();
    const { result } = renderHook(
      () => {
        return useLoginMutate();
      },
      { wrapper }
    );

    result.current.mutate({ email: 'a@b.c', password: 'pw12345678' });
    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    expect(login).toHaveBeenCalledWith(
      { email: 'a@b.c', password: 'pw12345678' },
      expect.anything()
    );
  });

  it('성공 시 me 캐시에 응답 user를 저장한다', async () => {
    const mockUser = { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' };
    (login as Mock).mockResolvedValue({ user: mockUser, accessExpiresAt: 0 });

    const { queryClient, wrapper } = setup();
    const { result } = renderHook(
      () => {
        return useLoginMutate();
      },
      { wrapper }
    );

    result.current.mutate({ email: 'a@b.c', password: 'pw12345678' });
    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    expect(queryClient.getQueryData(authKeys.me())).toEqual(mockUser);
  });

  it('실패 시 me 캐시는 변하지 않고 isError가 true가 된다', async () => {
    (login as Mock).mockRejectedValue(new Error('401 Unauthorized'));

    const { queryClient, wrapper } = setup();
    const { result } = renderHook(
      () => {
        return useLoginMutate();
      },
      { wrapper }
    );

    result.current.mutate({ email: 'a@b.c', password: 'wrong' });
    await waitFor(() => {
      return expect(result.current.isError).toBe(true);
    });

    expect(queryClient.getQueryData(authKeys.me())).toBeUndefined();
  });
});
