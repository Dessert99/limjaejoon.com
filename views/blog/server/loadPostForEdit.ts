import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

/** 편집 화면이 쓸 글 원본. 없으면 null이라 페이지가 404로 넘긴다. */
export const loadPostForEdit = async (
  client: SupabaseClient<Database>,
  id: string
) => {
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};
