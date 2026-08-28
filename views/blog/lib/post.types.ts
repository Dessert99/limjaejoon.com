import type { Database } from '@/lib/supabase/database.types';

/** 목록에서 걸 수 있는 조건. 주소창의 q·tag 파라미터와 같은 모양이다. */
export type PostSearchParams = {
  q?: string;
  tags?: string[];
};

/** 글 한 편. DB 행에 태그 이름을 접어 붙인 형태다. */
export type Post = Database['public']['Tables']['posts']['Row'] & {
  tags: string[];
};

/** 목록·검색에 필요한 만큼만 담은 글. 본문 마크다운은 빼서 페이로드를 줄인다. */
export type PostListItem = Pick<
  Post,
  'id' | 'slug' | 'title' | 'description' | 'tags' | 'published_at'
>;

/** 글 생성·수정 요청 본문. 태그는 이름이 아니라 id로 넘긴다. */
export type UpsertPostInput = {
  title: string;
  slug: string;
  description: string;
  tag_ids: string[];
  published_at: string;
  content_markdown: string;
};
