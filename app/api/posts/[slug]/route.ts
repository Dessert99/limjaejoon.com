import { getPostBySlug } from '@/domains/posts/api/posts';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

/** 주소로 글 한 편. 없으면 404다. */
export const GET = async (_request: Request, context: RouteContext) => {
  const { slug } = await context.params;
  const client = createSupabaseStaticClient();
  const post = await getPostBySlug(client, slug);

  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ post });
};
