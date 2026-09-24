import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { PeekHashScroll } from '@/views/blog/components/PeekHashScroll';
import { PeekShell } from '@/views/blog/components/PeekShell';
import { PostContent } from '@/views/blog/components/PostContent';
import {
  getPostBySlug,
  getPostSlugs,
  getPosts,
} from '@/views/blog/server/posts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/** 피크를 미리 구우면서 /blog/(.)slug 주소로도 열려, B와 겹치는 빈약한 페이지가 색인되지 않게 막는다. */
export const metadata: Metadata = {
  robots: { index: false },
};

/** 글마다 피크 하나라 상세 페이지와 같은 목록으로 미리 굽는다. */
export const generateStaticParams = async () => {
  const slugs = await getPostSlugs(createSupabaseStaticClient());

  return slugs.map((slug) => {
    return { slug };
  });
};

/** 글 안에서 다른 글로 넘어갈 때 페이지를 바꾸지 않고 옆에 띄우는 피크. */
export default async function PostPeek({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = createSupabaseStaticClient();
  const [post, posts] = await Promise.all([
    getPostBySlug(client, slug),
    getPosts(client),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <PeekShell>
      <h2 className='text-2xl font-semibold'>{post.title}</h2>
      <PostContent
        markdown={post.content_markdown}
        posts={posts}
        idPrefix='peek-'
      />
      <PeekHashScroll idPrefix='peek-' />
    </PeekShell>
  );
}
