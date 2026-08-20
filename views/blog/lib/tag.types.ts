import type { Database } from '@/lib/supabase/database.types';

/** 태그 한 개의 DB 행. */
export type Tag = Database['public']['Tables']['tags']['Row'];

/** 태그 관리 화면용. 붙은 글 수가 있어야 지울 수 있는지 판단한다. */
export type TagWithUsage = Pick<Tag, 'id' | 'name'> & { postCount: number };
