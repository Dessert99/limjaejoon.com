// 위시리스트 삭제 mutation — 성공 시 list 쿼리 invalidate로 서버 데이터 동기화
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeWishlist } from '@/features/tour/api/wishlist';
import { wishlistKeys } from '@/features/tour/constants/wishlistkeys';

export function useRemoveWishlistMutate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWishlist,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });
    },
  });
}
