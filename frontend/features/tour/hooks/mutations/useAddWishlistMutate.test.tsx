// useAddWishlistMutate hook 단위 테스트 — mutation 호출 + 성공 시 invalidate 검증
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/tour/api/wishlist', () => {
  return {
    addWishlist: vi.fn(),
    listWishlist: vi.fn(),
    removeWishlist: vi.fn(),
  };
});

import { addWishlist } from '@/features/tour/api/wishlist';
import { wishlistKeys } from '@/features/tour/constants/wishlistkeys';
import { useAddWishlistMutate } from '@/features/tour/hooks/mutations/useAddWishlistMutate';

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

describe('useAddWishlistMutate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mutate 호출 시 addWishlist API를 동일 인자로 호출한다', async () => {
    (addWishlist as Mock).mockResolvedValue({
      id: 'server-w1',
      contentId: '99999',
      title: '남산타워',
      firstImage: null,
      addr: null,
      createdAt: '2026-05-01T00:00:00.000Z',
    });

    const { wrapper } = setup();
    const { result } = renderHook(() => {
return useAddWishlistMutate()
}, { wrapper });

    result.current.mutate({ contentId: '99999', title: '남산타워' });

    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    // v5는 mutationFn에 (variables, context) 두 인자를 넘기므로 첫 인자만 확인
    expect((addWishlist as Mock).mock.calls[0]?.[0]).toEqual({
      contentId: '99999',
      title: '남산타워',
    });
  });

  it('성공 시 wishlistKeys.list() 쿼리를 invalidate한다', async () => {
    (addWishlist as Mock).mockResolvedValue({
      id: 'server-w1',
      contentId: '99999',
      title: '남산타워',
      firstImage: null,
      addr: null,
      createdAt: '2026-05-01T00:00:00.000Z',
    });

    const { queryClient, wrapper } = setup();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => {
return useAddWishlistMutate()
}, { wrapper });
    result.current.mutate({ contentId: '99999', title: '남산타워' });

    await waitFor(() => {
      return expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: wishlistKeys.list(),
    });
  });

  it('실패 시 isError가 true가 된다', async () => {
    (addWishlist as Mock).mockRejectedValue(new Error('500 Server Error'));

    const { wrapper } = setup();
    const { result } = renderHook(() => {
return useAddWishlistMutate()
}, { wrapper });

    result.current.mutate({ contentId: '99999', title: '남산타워' });

    await waitFor(() => {
      return expect(result.current.isError).toBe(true);
    });
  });
});
