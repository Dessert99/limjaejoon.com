// 로그아웃 API — 성공 시 tokenStore를 초기화한다
import { apiClient } from '@/lib/api/client';
import { clearAuth } from '@/lib/api/tokenStore';

export const logout = async (): Promise<{ ok: boolean }> => {
  const { data } = await apiClient.post<{ ok: boolean }>('/auth/logout');
  // accessExpiresAt과 refreshPromise 뮤텍스를 모두 초기화한다
  clearAuth();
  return data;
};
