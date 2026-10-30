import type { Database } from '@/lib/supabase/database.types';

/** 책 한 권의 DB 행. 개념 글이 묶이는 대주제이고, category가 방 안 더미다. */
export type Book = Database['public']['Tables']['books']['Row'];

/** 글에 접어 붙이는 책 요약. 목록·상세가 주소와 제목만 쓴다. */
export type BookRef = Pick<Book, 'slug' | 'title'>;
