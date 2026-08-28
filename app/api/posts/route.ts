import { getPosts } from '@/views/blog/server/posts';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/** 발행 최신순 글 목록. 글 읽기는 누구에게나 열려 있어 관문을 두지 않는다. */
export const GET = async () => {
  const client = await createSupabaseServerClient();
  const posts = await getPosts(client);

  return NextResponse.json({ posts });
};
