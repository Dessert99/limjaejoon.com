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

/** 피크 주소로도 열리는 빈약한 페이지가 글 상세와 겹쳐 색인되지 않게 막는다. */
export const metadata: Metadata = {
  robots: { index: false },
};

/** 회고가 칩으로 거는 건 개념 글이라 개념 글 목록으로 미리 굽는다. */
export const generateStaticParams = async () => {
  const slugs = await getPostSlugs(createSupabaseStaticClient(), 'concept');

  return slugs.map((slug) => {
    return { slug };
  });
};

/** 회고 안에서 개념 글 칩을 누르면 창밖을 떠나지 않고 옆에 띄우는 피크. */
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
