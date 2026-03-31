import { BlogList } from '@/features/blog/components/BlogList';
import { TagSidebar } from '@/features/blog/components/TagSidebar';
import { getPostList, getTagList } from '@/features/blog/lib/posts';
import { Suspense } from 'react';
import * as s from './blog.css';

export default function BlogPage() {
  const posts = getPostList();
  const tags = getTagList();

  return (
    <main className={s.main}>
      <header className={s.header}>
        <h1 className={s.heading}>블로그</h1>
        <p className={s.description}>저의 모든 성장은 이곳에 기록됩니다.</p>
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
