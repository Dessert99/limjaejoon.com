// 로그인 API — 성공 시 accessExpiresAt을 tokenStore에 기록한다
import { apiClient } from '@/lib/api/client';
import { setAccessExpiresAt } from '@/lib/api/tokenStore';

import type { LoginRequest, LoginResponse } from '@/features/auth/types';

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', body);
  // 사전 refresh 타이머에 사용할 만료 시각을 저장한다
  setAccessExpiresAt(data.accessExpiresAt);
  return data;
};
