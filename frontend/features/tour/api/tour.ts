// 관광지 도메인 API — 검색·상세(common/intro). 클라이언트는 apiClient(브라우저 쿠키 자동), RSC는 serverFetch(쿠키 수동 전달)
import { cache } from 'react';

import { cookies } from 'next/headers';

import { apiClient } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/base-url';

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

// RSC 전용 fetch 헬퍼 — apiClient(axios)는 withCredentials가 브라우저 전용이라 서버에선 쿠키 자동 전송 안 됨
async function serverFetch<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      // httpOnly 쿠키를 서버 측에서 수동 전달
      ...(accessToken?.value
        ? { cookie: `access_token=${accessToken.value}` }
        : {}),
    },
    cache: 'no-store', // 사용자별 데이터이므로 CDN 캐시 금지
  });

  if (!response.ok) {
    throw new Error(
      `serverFetch failed: ${path} (${response.status.toString()})`
    );
  }

  return response.json() as Promise<T>;
}

// React cache()로 같은 요청 내 중복 호출 dedup — generateMetadata + page.tsx 동시 호출 시 fetch 1회만 (ADR 0004 §4)
export const fetchTourCommonOnServer = cache(
  async (contentId: string): Promise<TourDetail> => {
    return serverFetch<TourDetail>(`/tour/${contentId}/common`);
  }
);
