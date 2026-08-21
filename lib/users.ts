import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

/** 사용자 한 명의 DB 행. */
export type User = Database['public']['Tables']['users']['Row'];

/** 가입 최신순 사용자 목록. */
export const getUsers = async (
  client: SupabaseClient<Database>
): Promise<User[]> => {
  const { data, error } = await client
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
