import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { Book } from '../lib/book.types';

/** 책 목록을 정렬 순서대로. 방 안 더미와 편집기의 책 선택이 같은 순서를 본다. */
export const getBooks = async (
  client: SupabaseClient<Database>
): Promise<Book[]> => {
  const { data, error } = await client
    .from('books')
    .select('*')
    .order('sort_order');

  if (error) {
    throw error;
  }

  return data ?? [];
};
