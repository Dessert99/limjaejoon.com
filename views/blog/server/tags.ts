import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { TagWithUsage } from '../lib/tag.types';

type TagRow = {
  id: string;
  name: string;
  post_tags: { count: number }[];
};

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
      postCount: tag.post_tags[0]?.count ?? 0,
    };
  });
};
