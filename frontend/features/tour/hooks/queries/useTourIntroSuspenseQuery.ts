// 관광지 소개 정보 Suspense 훅 — common 응답의 contentTypeId 확보 후 호출됨
// 호출자는 useTourCommonSuspenseQuery의 data.contentTypeId가 확정된 다음 이 훅을 사용해야 함
// (Suspense 흐름상 common이 먼저 unsuspend → intro 마운트 → 다시 suspend → unsuspend)
import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchTourIntro } from '@/features/tour/api/tour';
import { tourKeys } from '@/features/tour/constants/tourkeys';

export function useTourIntroSuspenseQuery(
  contentId: string,
  contentTypeId: string
) {
  return useSuspenseQuery({
    queryKey: tourKeys.intro(contentId, contentTypeId),
    queryFn: () => {
      return fetchTourIntro(contentId, contentTypeId);
    },
  });
}
