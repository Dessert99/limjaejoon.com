import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { BlogAdminActions } from '@/views/blog/components/BlogAdminActions';
import { PostBrowser } from '@/views/blog/components/PostBrowser/PostBrowser';
import type { PostListItem } from '@/views/blog/lib/post.types';
import { getPosts } from '@/views/blog/server/posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'jaejoon blog',
  description: '지금까지 쌓아온 개발 지식 모음',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/blog',
    title: 'jaejoon blog',
    description: '지금까지 쌓아온 개발 지식 모음',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'limjaejoon blog',
      },
    ],
  },
};

const collectTags = (posts: PostListItem[]): string[] => {
  const tags = new Set<string>();

  for (const post of posts) {
    post.tags.forEach((tag) => {
      tags.add(tag);
    });
  }

  return [...tags].sort();
};

export default async function BlogPage() {
  const posts = await getPosts(createSupabaseStaticClient());

  return (
    <main className='grow pt-blog-section-sm pb-blog-section'>
      <div className='mx-auto max-w-blog px-blog-gutter'>
        <BlogAdminActions />
        <PostBrowser
          posts={posts}
          tags={collectTags(posts)}
        />
      </div>
    </main>
  );
}
