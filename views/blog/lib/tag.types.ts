/** tags 엔티티의 앱-facing 타입 별칭 */
import type { Database } from '@/lib/supabase/database.types';

/** tags 행 타입 */
export type Tag = Database['public']['Tables']['tags']['Row'];

/** 관리 화면용 태그 — 지울 수 있는지를 누르기 전에 보여주려면 글 수가 함께 와야 한다 */
export type TagWithUsage = Pick<Tag, 'id' | 'name'> & { postCount: number };
