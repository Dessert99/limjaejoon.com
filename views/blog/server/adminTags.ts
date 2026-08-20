import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { Tag } from '../lib/tag.types';

/** 앞뒤 공백만 털어 같은 태그가 둘로 갈리는 걸 막는다. */
export const normalizeTagName = (name: string): string => {
  return name.trim();
};

/** 행이 안 돌아온 쓰기를 성공으로 넘기지 않게 막는다. 타입상 null이 열려 있다. */
const assertTag = (tag: Tag | null): Tag => {
  if (!tag) {
    throw new Error('Tag write returned no data');
  }

  return tag;
};

/** 태그를 새로 만든다. 이름이 겹치면 DB 유니크 제약이 막는다. */
export const createAdminTag = async (
  client: SupabaseClient<Database>,
  name: string
): Promise<Tag> => {
  const { data, error } = await client
    .from('tags')
    .insert({ name: normalizeTagName(name) })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return assertTag(data);
};

/** 태그 이름을 고친다. 없는 id면 null이라 라우트가 404로 답한다. */
export const updateAdminTag = async (
  client: SupabaseClient<Database>,
  id: string,
  name: string
): Promise<Tag | null> => {
  const { data, error } = await client
    .from('tags')
    .update({ name: normalizeTagName(name) })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

/** 태그를 지우고 실제로 지워졌는지 알린다. 글이 붙어 있으면 DB가 막는다. */
export const deleteAdminTag = async (
  client: SupabaseClient<Database>,
  id: string
): Promise<boolean> => {
  const { data, error } = await client
    .from('tags')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    throw error;
  }

  return (data?.length ?? 0) > 0;
};
