import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

export type User = Database['public']['Tables']['users']['Row'];

export const getUsers = async (
  client: SupabaseClient<Database>
): Promise<User[]> => {
  const { data, error } = await client
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
