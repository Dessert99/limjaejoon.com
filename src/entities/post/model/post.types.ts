/** posts 엔티티의 앱-facing 타입 별칭 */
import type { Database } from '@/shared/api';

/** posts series 타입 — 단발 글은 null 로 둔다 */
export type PostSeries = string | null;

/** 공개 목록 검색 조건 — URL query와 Supabase query 사이의 앱-facing 계약 */
export type PostSearchParams = {
  q?: string;
  series?: string;
  /** 겹칠수록 좁아진다 — 전부 가진 글만 남는 AND 다 */
  tags?: string[];
};

/** posts 상세 행 타입 — Markdown 본문과 관리용 메타데이터를 포함한다 */
export type Post = Database['public']['Tables']['posts']['Row'];

/** 공개 목록에서 필요한 posts 필드만 노출한다 */
export type PostListItem = Pick<
  Post,
  'id' | 'slug' | 'title' | 'description' | 'tags' | 'series' | 'published_at'
>;
