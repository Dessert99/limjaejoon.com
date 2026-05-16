// 관광지 공통 정보 Suspense 훅 — /tour/[contentId] 상세 페이지 본문에서 사용
// useSuspenseQuery: 데이터 로딩 중 가장 가까운 Suspense fallback으로 자동 위임 (isLoading 분기 불필요)
import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchTourCommon } from '@/features/tour/api/tour';
import { tourKeys } from '@/features/tour/constants/tourkeys';

export function useTourCommonSuspenseQuery(contentId: string) {
  return useSuspenseQuery({
    queryKey: tourKeys.common(contentId),
    queryFn: () => {
      return fetchTourCommon(contentId);
    },
  });
}
