/** tags 엔티티의 admin write helper — Route Handler 밖에서 Supabase mutation 을 캡슐화한다 */
import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { Tag } from '../lib/tag.types';

/** 태그 이름을 정규화한다 — lower(name) unique 는 앞뒤 공백만 다른 표기를 못 막는다 */
export const normalizeTagName = (name: string): string => {
  return name.trim();
};

const assertTag = (tag: Tag | null): Tag => {
  if (!tag) {
    throw new Error('Tag write returned no data');
  }

  return tag;
};

/** 세션 client 로 태그를 만든다 — 같은 이름(대소문자 무시)이면 23505 */
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

/** 세션 client 로 태그 이름을 고친다 — 연결은 tag_id 를 보므로 글은 건드릴 게 없다 */
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

/** 세션 client 로 태그를 지운다 — 지운 행이 없으면 false. 연결된 글이 있으면 FK 가 23503 을 던진다 */
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
