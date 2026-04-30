// 로그아웃 mutation — 성공 시 모든 QueryClient 캐시를 제거한다 (ADR 0007: B3)
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logout } from '../api/logout';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 이전 사용자 캐시 잔존 0 보장 — 다른 도메인 캐시 생기면 narrow 재검토 (ADR 0007)
      queryClient.clear();
    },
  });
};
