import type { Database } from '@/lib/supabase/database.types';

export type Tag = Database['public']['Tables']['tags']['Row'];

export type TagWithUsage = Pick<Tag, 'id' | 'name'> & { postCount: number };
