// 관광지 검색 무한 스크롤 query — useInfiniteQuery로 페이지 단위 누적 로드
import { useInfiniteQuery } from '@tanstack/react-query';

import { searchTours } from '@/features/tour/api/tour';
import { tourKeys } from '@/features/tour/constants/tourkeys';

export function useTourSearchQuery(keyword: string) {
  return useInfiniteQuery({
    queryKey: tourKeys.search(keyword),
    queryFn: ({ pageParam }) => {
      return searchTours(keyword, pageParam as number);
    },
    initialPageParam: 1,
    // hasMore=true면 다음 페이지 번호 반환, false면 undefined로 무한 스크롤 종료
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    // 빈 keyword일 때 enabled: false — API 호출 차단 (부하·UX 개선)
    enabled: keyword.trim().length > 0,
    // ADR 0004 §3-1: 검색은 외부 KorService2 API 부담 완화를 위해 30초 staleTime override
    staleTime: 30_000,
  });
}
