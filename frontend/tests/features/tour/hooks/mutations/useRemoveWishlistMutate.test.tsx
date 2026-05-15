// useRemoveWishlistMutate hook 단위 테스트 — mutation 호출 + 성공 시 invalidate 검증
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/tour/api/wishlist', () => {
  return {
    listWishlist: vi.fn(),
    addWishlist: vi.fn(),
    removeWishlist: vi.fn(),
  };
});

import { removeWishlist } from '@/features/tour/api/wishlist';
import { wishlistKeys } from '@/features/tour/constants/wishlistkeys';
import { useRemoveWishlistMutate } from '@/features/tour/hooks/mutations/useRemoveWishlistMutate';

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

describe('useRemoveWishlistMutate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mutate 호출 시 removeWishlist API를 같은 id로 호출한다', async () => {
    (removeWishlist as Mock).mockResolvedValue(undefined);

    const { wrapper } = setup();
    const { result } = renderHook(() => useRemoveWishlistMutate(), { wrapper });

    result.current.mutate('w1');

    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    expect((removeWishlist as Mock).mock.calls[0]?.[0]).toBe('w1');
  });

  it('성공 시 wishlistKeys.list() 쿼리를 invalidate한다', async () => {
    (removeWishlist as Mock).mockResolvedValue(undefined);

    const { queryClient, wrapper } = setup();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useRemoveWishlistMutate(), { wrapper });
    result.current.mutate('w1');

    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: wishlistKeys.list(),
    });
  });

  it('실패 시 isError가 true가 된다', async () => {
    (removeWishlist as Mock).mockRejectedValue(new Error('404 Not Found'));

    const { wrapper } = setup();
    const { result } = renderHook(() => useRemoveWishlistMutate(), { wrapper });

    result.current.mutate('w1');

    await waitFor(() => {
      return expect(result.current.isError).toBe(true);
    });
  });
});
