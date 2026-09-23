import type { Database } from '@/lib/supabase/database.types';
import type { BookRef } from './book.types';

/** 글의 갈래. concept는 책 한 권에 속한 개념 정리, story는 책 없는 회고·에세이다. */
export type PostKind = 'concept' | 'story';

/** 목록에서 걸 수 있는 조건. 주소창의 q·book 파라미터와 같은 모양이다. */
export type PostSearchParams = {
  q?: string;
  book?: string;
};

/** 글 한 편. DB 행에 책 요약을 접어 붙인 형태다. 이야기는 책이 null이다. */
export type Post = Database['public']['Tables']['posts']['Row'] & {
  book: BookRef | null;
};

/** 목록·검색에 필요한 만큼만 담은 글. 본문 마크다운은 빼서 페이로드를 줄인다. */
export type PostListItem = Pick<
  Post,
  'id' | 'slug' | 'title' | 'description' | 'kind' | 'book' | 'published_at'
>;

/** 글 생성·수정 요청 본문. 개념 글은 book_id가 있어야 하고 이야기는 null이다. */
export type UpsertPostInput = {
  title: string;
  slug: string;
  description: string;
  kind: PostKind;
  book_id: string | null;
  published_at: string;
  content_markdown: string;
};
