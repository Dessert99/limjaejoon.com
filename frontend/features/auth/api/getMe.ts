// 현재 로그인된 사용자 정보를 조회한다 — useMe 쿼리 함수로 사용
import { apiClient } from '@/lib/api/client';

import type { MeResponse } from '@/features/auth/types';

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await apiClient.get<MeResponse>('/auth/me');
  return data;
};
