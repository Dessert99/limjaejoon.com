// useSignupMutate hook 단위 테스트 — TanStack mutation + me 캐시 갱신 검증
// 핵심: hook은 QueryClientProvider 컨텍스트가 필요 → renderHook의 wrapper로 주입
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// signup API를 mock — 진짜 네트워크 호출 차단, 응답을 테스트가 통제
vi.mock('@/features/auth/api/signup', () => {
  return {
    signup: vi.fn(),
  };
});

import { signup } from '@/features/auth/api/signup';
import { authKeys } from '@/features/auth/constants/authkeys';
import { useSignupMutate } from '@/features/auth/hooks/mutations/useSignupMutate';

// 매 테스트마다 fresh QueryClient + Provider wrapper를 생성하는 헬퍼
// queryClient를 외부로 노출해 캐시 상태를 직접 검증할 수 있게 한다
function setup() {
  // retry: false — 테스트는 실패 시 즉시 종료되어야 함 (기본 retry 3회는 테스트 느려짐)
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

describe('useSignupMutate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mutate 호출 시 signup API를 동일 인자로 호출한다', async () => {
    const mockUser = { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' };
    (signup as Mock).mockResolvedValue({
      user: mockUser,
      accessExpiresAt: 123,
    });

    const { wrapper } = setup();
    // renderHook — hook을 테스트용 컴포넌트 안에서 실행해주는 헬퍼
    const { result } = renderHook(
      () => {
        return useSignupMutate();
      },
      { wrapper }
    );

    // result.current — 현재 hook 반환값 (TanStack의 mutation 객체)
    result.current.mutate({ email: 'a@b.c', password: 'pw12345678' });

    // waitFor — 비동기 상태 변화를 기다림 (mutation은 Promise라 즉시 안 끝남)
    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    // TanStack Query v5는 mutationFn에 (variables, context) 두 인자를 넘김
    // 첫 번째 인자(variables)만 검증, 두 번째는 expect.anything()으로 허용
    expect(signup).toHaveBeenCalledWith(
      { email: 'a@b.c', password: 'pw12345678' },
      expect.anything()
    );
  });

  it('성공 시 me 캐시(authKeys.me())에 응답 user를 저장한다', async () => {
    const mockUser = { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' };
    (signup as Mock).mockResolvedValue({
      user: mockUser,
      accessExpiresAt: 123,
    });

    const { queryClient, wrapper } = setup();
    const { result } = renderHook(
      () => {
        return useSignupMutate();
      },
      { wrapper }
    );

    result.current.mutate({ email: 'a@b.c', password: 'pw12345678' });
    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    // 핵심: setQueryData로 me 캐시가 즉시 채워졌는지 확인 (추가 GET /auth/me 불필요)
    expect(queryClient.getQueryData(authKeys.me())).toEqual(mockUser);
  });

  it('실패 시 me 캐시는 변하지 않고 isError가 true가 된다', async () => {
    (signup as Mock).mockRejectedValue(new Error('409 Conflict'));

    const { queryClient, wrapper } = setup();
    const { result } = renderHook(
      () => {
        return useSignupMutate();
      },
      { wrapper }
    );

    result.current.mutate({ email: 'a@b.c', password: 'pw12345678' });
    await waitFor(() => {
      return expect(result.current.isError).toBe(true);
    });

    expect(queryClient.getQueryData(authKeys.me())).toBeUndefined();
  });
});
