import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { PostContent } from '@/views/blog/components/PostContent';
import {
  getPostBySlug,
  getPostSlugs,
  getPosts,
} from '@/views/blog/server/posts';
import { notFound } from 'next/navigation';

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
    <aside
      aria-label='참고 글'
      className='fixed inset-y-0 right-0 w-[32rem] overflow-y-auto border-l border-blog-border bg-blog-background p-8'>
      <h2 className='text-2xl font-semibold'>{post.title}</h2>
      <PostContent
        markdown={post.content_markdown}
        posts={posts}
      />
    </aside>
  );
}
