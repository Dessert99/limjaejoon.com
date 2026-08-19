import type { Database } from '@/lib/supabase/database.types';

export type PostSearchParams = {
  q?: string;
  tags?: string[];
};

export type Post = Database['public']['Tables']['posts']['Row'] & {
  tags: string[];
};

export type PostListItem = Pick<
  Post,
  'id' | 'slug' | 'title' | 'description' | 'tags' | 'published_at'
>;

export type UpsertPostInput = {
  title: string;
  slug: string;
  description: string;
  tag_ids: string[];
  published_at: string;
  content_markdown: string;
};
