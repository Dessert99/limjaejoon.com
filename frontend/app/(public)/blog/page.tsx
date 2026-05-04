import { BlogList } from '@/features/blog/components/BlogList';
import { TagSidebar } from '@/features/blog/components/TagSidebar';
import { getPostList } from '@/features/blog/lib/posts';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import * as s from './blog.css';

export const metadata: Metadata = {
  title: '지식 모음',
  description: '개념 정리와 레퍼런스를 모아두는 공간입니다.',
  openGraph: {
    title: '지식 모음',
    description: '개념 정리와 레퍼런스를 모아두는 공간입니다.',
  },
};

export default function BlogPage() {
  const posts = getPostList();
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();

  return (
    <main className={s.main}>
      <header className={s.header}>
        <h1 className={s.heading}>지식 모음</h1>
        <p className={s.description}>
          개념 정리와 레퍼런스를 모아두는 공간입니다.
        </p>
      </header>

      <div className={s.layout}>
        <Suspense>
          <TagSidebar tags={tags} />
        </Suspense>
        <Suspense>
          <BlogList posts={posts} />
        </Suspense>
      </div>
    </main>
  );
}
