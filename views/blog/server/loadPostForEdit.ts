import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

export const loadPostForEdit = async (
  client: SupabaseClient<Database>,
  id: string
) => {
  const { data, error } = await client
    .from('posts')
    .select('*, post_tags(tag_id)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    post: data,
    tagIds: data.post_tags.map((link) => {
      return link.tag_id;
    }),
  };
};
