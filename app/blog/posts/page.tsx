import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { BlogAdminActions } from '@/views/blog/components/BlogAdminActions';
import { PostBrowser } from '@/views/blog/components/PostBrowser/PostBrowser';
import { getBooks } from '@/views/blog/server/books';
import { getPosts } from '@/views/blog/server/posts';
import type { Metadata } from 'next';

/** 목록 페이지 메타. canonical을 /blog/posts로 못 박아 필터가 붙은 주소가 따로 색인되지 않게 한다. */
export const metadata: Metadata = {
  title: 'jaejoon blog',
  description: '지금까지 쌓아온 개발 지식 모음',
  alternates: { canonical: '/blog/posts' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/blog/posts',
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

/** 글 목록 페이지. 빌드 때 정적으로 뽑고 필터는 클라이언트가 맡는다. */
export default async function PostsPage() {
  const client = createSupabaseStaticClient();
  const [posts, books] = await Promise.all([
    getPosts(client),
    getBooks(client),
  ]);

  return (
    <main className='grow pt-blog-section-sm pb-blog-section'>
      <div className='mx-auto max-w-blog px-blog-gutter'>
        <BlogAdminActions />
        <PostBrowser
          posts={posts}
          books={books}
        />
      </div>
    </main>
  );
}
