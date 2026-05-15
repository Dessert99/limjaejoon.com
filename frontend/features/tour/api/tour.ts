// 관광지 도메인 클라이언트 API — 검색·상세(common/intro). apiClient(axios)는 브라우저 쿠키 자동 전송
// RSC 전용 fetcher는 ./tour.server 참고 (next/headers 의존이라 분리)
import { apiClient } from '@/lib/api/client';

import type {
  TourDetail,
  TourIntro,
  TourSearchResponse,
} from '@/features/tour/types';

// 키워드 검색 — axios가 params 객체의 한글을 자동 percent-encoding하므로 추가 인코딩 불필요
export const searchTours = async (
  keyword: string,
  page: number
): Promise<TourSearchResponse> => {
  const { data } = await apiClient.get<TourSearchResponse>('/tour/search', {
    params: { keyword, page },
  });
  return data;
};

// 공통 정보 — 상세 페이지에서 useSuspenseQuery로 호출
export const fetchTourCommon = async (
  contentId: string
): Promise<TourDetail> => {
  const { data } = await apiClient.get<TourDetail>(`/tour/${contentId}/common`);
  return data;
};

// 소개 정보 — contentTypeId는 detailIntro2 외부 API 필수 파라미터(common 응답에서 받아 함께 전달)
export const fetchTourIntro = async (
  contentId: string,
  contentTypeId: string
): Promise<TourIntro> => {
  const { data } = await apiClient.get<TourIntro>(`/tour/${contentId}/intro`, {
    params: { contentTypeId },
  });
  return data;
};
