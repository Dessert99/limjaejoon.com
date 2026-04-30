// 토큰 갱신 API — 성공 시 새 accessExpiresAt을 tokenStore에 기록한다
import { apiClient } from '@/lib/api/client';
import { setAccessExpiresAt } from '@/lib/api/tokenStore';

import type { LoginResponse } from '../types';

export const refresh = async (): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/refresh');
  // 사전 refresh 타이머를 새 만료 시각으로 재설정한다
  setAccessExpiresAt(data.accessExpiresAt);
  return data;
};
