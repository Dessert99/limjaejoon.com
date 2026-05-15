// 로그인 mutation — 성공 시 me 캐시를 즉시 채운다 (ADR 0007: C2)
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login } from '@/features/auth/api/login';
import { authKeys } from '@/features/auth/constants/authkeys';

export const useLoginMutate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // 추가 fetch 없이 응답 user를 me 캐시에 직접 설정한다
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
};
