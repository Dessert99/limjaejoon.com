// 현재 로그인된 사용자 정보를 구독한다 — 보호 라우트 전용 (ADR 0007)
// staleTime·retry는 QueryClient 전역 default(5분 / false)에 위임
import { useQuery } from '@tanstack/react-query';

import { getMe } from '../api/getMe';
import { authKeys } from '../constants/keys';

export const useMe = () =>
  useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
  });
