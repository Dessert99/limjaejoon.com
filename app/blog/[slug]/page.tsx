import { getPostSlugs } from '@/entities/post';
import { BlogPostPage, loadPost } from '@/pages/blog-post';
import { createSupabaseStaticClient } from '@/shared/api';
import type { Metadata } from 'next';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/** 발행된 글 경로를 빌드 시점에 미리 만든다 (그 뒤 발행분은 첫 요청에 생성된다) */
export const generateStaticParams = async () => {
  const slugs = await getPostSlugs(createSupabaseStaticClient());

  return slugs.map((slug) => {
    return { slug };
  });
};

/** 글마다 제목·설명·공유 카드를 붙인다 (없는 글이면 레이아웃 기본값이 남는다) */
export const generateMetadata = async (
  context: RouteContext
): Promise<Metadata> => {
  const { slug } = await context.params;
  const post = await loadPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      tags: [...post.tags],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.description,
    },
  };
};

export default async function Page(context: RouteContext) {
  const { slug } = await context.params;

  return <BlogPostPage slug={slug} />;
}
