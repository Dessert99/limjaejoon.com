import { getPostBySlug } from '@/views/blog/server/posts';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export const GET = async (_request: Request, context: RouteContext) => {
  const { slug } = await context.params;
  const client = await createSupabaseServerClient();
  const post = await getPostBySlug(client, slug);

  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ post });
};
