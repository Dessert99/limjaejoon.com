import { getPublishedPosts } from '@/entities/post';
import { createSupabaseServerClient } from '@/shared/api';
import { NextResponse } from 'next/server';

/** 공개 발행 글 목록을 반환한다 */
export const GET = async () => {
  const client = await createSupabaseServerClient();
  const posts = await getPublishedPosts(client);

  return NextResponse.json({ posts });
};
