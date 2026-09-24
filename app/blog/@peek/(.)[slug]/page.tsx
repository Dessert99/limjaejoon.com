import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { PeekBackdrop } from '@/views/blog/components/PeekBackdrop';
import { PeekHashScroll } from '@/views/blog/components/PeekHashScroll';
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
    <>
      <PeekBackdrop />
      {/* 좁은 화면은 아래에서 올라오는 시트(높이 85svh), md부터 오른쪽에 붙어 A 위를 덮는 48rem 패널이다. 85를 키우면 A가 거의 안 보이고, 줄이면 읽을 칸이 좁아진다. 48rem은 A 본문 폭과 같아 B가 상세 페이지와 같은 줄 길이로 읽힌다 */}
      <aside
        aria-label='참고 글'
        className='fixed inset-x-0 bottom-0 z-(--z-overlay) h-[85svh] overflow-y-auto rounded-t-2xl border-t border-blog-border bg-blog-background p-6 md:inset-y-0 md:right-0 md:left-auto md:h-auto md:w-3xl md:rounded-none md:border-t-0 md:border-l md:p-8'>
        <h2 className='text-2xl font-semibold'>{post.title}</h2>
        <PostContent
          markdown={post.content_markdown}
          posts={posts}
          idPrefix='peek-'
        />
        <PeekHashScroll idPrefix='peek-' />
      </aside>
    </>
  );
}
