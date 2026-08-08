/** posts 엔티티의 앱-facing 타입 별칭 */
import type { Database } from '@/shared/api';

/** 공개 목록 검색 조건 — URL query와 Supabase query 사이의 앱-facing 계약 */
export type PostSearchParams = {
  q?: string;
  /** 겹칠수록 좁아진다 — 전부 가진 글만 남는 AND 다 */
  tags?: string[];
};

/** posts 상세 행 타입 — tags 는 컬럼이 아니라 post_tags 조인을 되접은 값이다 */
export type Post = Database['public']['Tables']['posts']['Row'] & {
  tags: string[];
};

/** 공개 목록에서 필요한 posts 필드만 노출한다 */
export type PostListItem = Pick<
  Post,
  'id' | 'slug' | 'title' | 'description' | 'tags' | 'published_at'
>;
