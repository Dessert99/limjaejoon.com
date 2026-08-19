import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { Tag } from '../lib/tag.types';

export const normalizeTagName = (name: string): string => {
  return name.trim();
};

const assertTag = (tag: Tag | null): Tag => {
  if (!tag) {
    throw new Error('Tag write returned no data');
  }

  return tag;
};

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
