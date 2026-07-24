/** users 엔티티의 조회 fetcher — react·tanstack 비의존 순수 transport */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/api';

/** 생성된 DB 스키마에서 파생한 users 행 타입 (스키마 변경 시 자동 반영) */
export type User = Database['public']['Tables']['users']['Row'];

/** users 전체를 created_at 내림차순으로 조회한다 (클라이언트는 호출 측이 주입) */
export const getUsers = async (
  client: SupabaseClient<Database>
): Promise<User[]> => {
  const { data, error } = await client
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  // PostgREST 에러는 서버 컴포넌트·테스트 등 호출 측이 처리하도록 그대로 전파
  if (error) {
    throw error;
  }

  return data;
};
