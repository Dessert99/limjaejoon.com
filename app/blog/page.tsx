import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { BlogAdminActions } from '@/views/blog/components/BlogAdminActions';
import { PostBrowser } from '@/views/blog/components/PostBrowser/PostBrowser';
import type { PostListItem } from '@/views/blog/lib/post.types';
import { getPosts } from '@/views/blog/server/posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '블로그',
  description: '읽고 만들며 배운 것을 정리해 둔 글 목록',
};

/** 필터 선택지는 목록을 한 번만 훑어 뽑는다 */
const collectTags = (posts: PostListItem[]): string[] => {
  const tags = new Set<string>();

  for (const post of posts) {
    post.tags.forEach((tag) => {
      tags.add(tag);
    });
  }

  return [...tags].sort();
};

/** Blog — 발행 글 목록. 정적으로 전부 굳히고 거르는 일은 브라우저가 한다 */
export default async function BlogPage() {
  const posts = await getPosts(createSupabaseStaticClient());

  return (
    // 밝은 바탕과 svh 는 app/blog/layout.tsx 가 소유한다
    // 위아래가 다르다 — 위는 nav 가 이미 자리를 먹어 절반이면 되고, 아래는 글이 끝났다는 여백이 그대로 필요하다
    <main className='grow pt-section-sm pb-section'>
      <div className='mx-auto max-w-content px-gutter'>
        <BlogAdminActions />
        <PostBrowser
          posts={posts}
          tags={collectTags(posts)}
        />
      </div>
    </main>
  );
}
