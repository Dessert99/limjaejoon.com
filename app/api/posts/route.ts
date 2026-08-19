import { getPosts } from '@/views/blog/server/posts';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const client = await createSupabaseServerClient();
  const posts = await getPosts(client);

  return NextResponse.json({ posts });
};
