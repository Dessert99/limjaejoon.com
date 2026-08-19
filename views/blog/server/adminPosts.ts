import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { Post, UpsertPostInput } from '../lib/post.types';

type PostRow = Database['public']['Tables']['posts']['Row'];

const assertRow = (row: PostRow | null): PostRow => {
  if (!row) {
    throw new Error('Post write returned no data');
  }

  return row;
};

const toColumns = (input: UpsertPostInput) => {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    published_at: input.published_at,
    content_markdown: input.content_markdown,
  };
};

const fetchTagNames = async (
  client: SupabaseClient<Database>,
  ids: string[]
): Promise<string[]> => {
  if (ids.length === 0) {
    return [];
  }

  const { data, error } = await client
    .from('tags')
    .select('name')
    .in('id', ids);

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((tag) => {
      return tag.name;
    })
    .sort();
};

const syncPostTags = async (
  client: SupabaseClient<Database>,
  postId: string,
  tagIds: string[]
): Promise<void> => {
  const { error: clearError } = await client
    .from('post_tags')
    .delete()
    .eq('post_id', postId);

  if (clearError) {
    throw clearError;
  }

  if (tagIds.length === 0) {
    return;
  }

  const { error } = await client.from('post_tags').insert(
    tagIds.map((tagId) => {
      return { post_id: postId, tag_id: tagId };
    })
  );

  if (error) {
    throw error;
  }
};

export const createAdminPost = async (
  client: SupabaseClient<Database>,
  input: UpsertPostInput
): Promise<Post> => {
  const { data, error } = await client
    .from('posts')
    .insert(toColumns(input))
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  const row = assertRow(data);

  try {
    await syncPostTags(client, row.id, input.tag_ids);
  } catch (linkError) {
    await client.from('posts').delete().eq('id', row.id);
    throw linkError;
  }

  return { ...row, tags: await fetchTagNames(client, input.tag_ids) };
};

export const deleteAdminPost = async (
  client: SupabaseClient<Database>,
  id: string
): Promise<boolean> => {
  const { data, error } = await client
    .from('posts')
    .delete()
    .eq('id', id)
    .select('id');

  if (error) {
    throw error;
  }

  return (data?.length ?? 0) > 0;
};

export const updateAdminPost = async (
  client: SupabaseClient<Database>,
  id: string,
  input: UpsertPostInput
): Promise<Post> => {
  const { data, error } = await client
    .from('posts')
    .update(toColumns(input))
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  const row = assertRow(data);

  await syncPostTags(client, row.id, input.tag_ids);

  return { ...row, tags: await fetchTagNames(client, input.tag_ids) };
};
