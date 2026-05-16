// 관광지 도메인 RSC 전용 fetcher — next/headers를 사용하므로 클라이언트 번들에 절대 끌려 들어가면 안 됨
// (page.tsx 등 서버 컴포넌트에서만 import). 클라이언트용 axios API는 ./tour 참고
import { cache } from 'react';

import { cookies } from 'next/headers';

import { API_BASE_URL } from '@/lib/base-url';

import type { TourDetail } from '@/features/tour/types';

// apiClient(axios)는 withCredentials가 브라우저 전용이라 서버에선 쿠키 자동 전송이 안 됨 → 수동 전달
const serverFetch = async <T>(path: string): Promise<T> => {
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
};

// React cache()로 같은 요청 내 중복 호출 dedup — generateMetadata + page.tsx 동시 호출 시 fetch 1회만 (ADR 0004 §4)
export const fetchTourCommonOnServer = cache(
  async (contentId: string): Promise<TourDetail> => {
    return serverFetch<TourDetail>(`/tour/${contentId}/common`);
  }
);
