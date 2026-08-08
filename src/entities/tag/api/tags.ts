/** tags 엔티티의 조회 fetcher — React 비의존 Supabase transport */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/api';
import type { TagWithUsage } from '../model/tag.types';

/** post_tags(count) 는 집계 하나를 배열에 담아 돌려준다 */
type TagRow = {
  id: string;
  name: string;
  post_tags: { count: number }[];
};

/** 등록된 태그를 이름순으로, 연결된 글 수와 함께 조회한다 */
export const getTags = async (
  client: SupabaseClient<Database>
): Promise<TagWithUsage[]> => {
  const { data, error } = await client
    .from('tags')
    .select('id, name, post_tags(count)')
    .order('name');

  if (error) {
    throw error;
  }

  return ((data ?? []) as TagRow[]).map((tag) => {
    return {
      id: tag.id,
      name: tag.name,
      // 연결이 0이면 집계 행 자체가 안 온다
      postCount: tag.post_tags[0]?.count ?? 0,
    };
  });
};
