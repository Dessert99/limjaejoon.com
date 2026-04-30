// 회원가입 API — 성공 시 accessExpiresAt을 tokenStore에 기록한다
import { apiClient } from '@/lib/api/client';
import { setAccessExpiresAt } from '@/lib/api/tokenStore';

import type { SignupRequest, SignupResponse } from '../types';

export const signup = async (body: SignupRequest): Promise<SignupResponse> => {
  const { data } = await apiClient.post<SignupResponse>('/auth/signup', body);
  // 사전 refresh 타이머에 사용할 만료 시각을 저장한다
  setAccessExpiresAt(data.accessExpiresAt);
  return data;
};
