import { getPosts } from '@/views/blog/server/posts';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/** 공개 발행 글 목록을 반환한다 */
export const GET = async () => {
  const client = await createSupabaseServerClient();
  const posts = await getPosts(client);

  return NextResponse.json({ posts });
};
