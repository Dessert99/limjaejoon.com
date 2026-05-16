// 위시리스트 추가 mutation — 성공 시 list 쿼리 invalidate로 서버 데이터 동기화
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addWishlist } from '@/features/tour/api/wishlist';
import { wishlistKeys } from '@/features/tour/constants/wishlistkeys';

export function useAddWishlistMutate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWishlist,
    onSuccess: () => {
      // 서버 응답 후 list 재요청 — 새 항목이 정렬·페이지네이션 정확히 반영
      return queryClient.invalidateQueries({ queryKey: wishlistKeys.list() });
    },
  });
}
