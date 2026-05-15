// 위시리스트 목록 조회 hook — 클라이언트 컴포넌트용 (staleTime·retry 등은 전역 QueryClient default에 위임)
import { useQuery } from '@tanstack/react-query';

import { listWishlist } from '@/features/tour/api/wishlist';
import { wishlistKeys } from '@/features/tour/constants/wishlistkeys';

export const useWishlistQuery = () => {
  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: listWishlist,
  });
};
