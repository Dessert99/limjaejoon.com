/** posts 엔티티의 앱-facing 타입 별칭 */
import type { Database } from '@/shared/api';

/** posts 상태값 타입 — DB enum 변경 시 생성 타입을 통해 함께 바뀐다 */
export type PostStatus = Database['public']['Enums']['post_status'];

/** posts category 타입 — 1차는 정규화 테이블 없이 문자열로 운영한다 */
export type PostCategory = string;

/** posts series 타입 — 단발 글은 null 로 둔다 */
export type PostSeries = string | null;

/** 공개 목록 검색 조건 — URL query와 Supabase query 사이의 앱-facing 계약 */
export type PostSearchParams = {
  q?: string;
  category?: string;
  series?: string;
  tag?: string;
};

/** posts 상세 행 타입 — Markdown 본문과 관리용 메타데이터를 포함한다 */
export type Post = Database['public']['Tables']['posts']['Row'];

/** 공개 목록에서 필요한 posts 필드만 노출한다 */
export type PostListItem = Pick<
  Post,
  | 'id'
  | 'slug'
  | 'title'
  | 'description'
  | 'tags'
  | 'category'
  | 'series'
  | 'published_at'
>;
