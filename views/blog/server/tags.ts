import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { TagWithUsage } from '../lib/tag.types';

type TagRow = {
  id: string;
  name: string;
  post_tags: { count: number }[];
};

/** 이름순 태그 목록. 붙은 글 수를 세어 관리 화면이 삭제 가능 여부를 판단한다. */
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
      // count 집계는 행 하나로 오고, 안 붙은 태그는 그 행조차 없다
      postCount: tag.post_tags[0]?.count ?? 0,
    };
  });
};
