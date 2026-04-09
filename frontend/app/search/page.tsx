import { getAllPostsForSearch } from '@/features/blog/lib/posts';
import { SearchContent } from '@/features/search/components/SearchContent';
import type { Metadata } from 'next';
import * as s from './search.css';

export const metadata: Metadata = {
  title: '검색',
  robots: { index: false, follow: false },
};

export default function SearchPage() {
  const posts = getAllPostsForSearch();

  return (
    <main className={s.main}>
      <header className={s.header}>
        <h1 className={s.heading}>검색</h1>
      </header>
      <SearchContent posts={posts} />
    </main>
  );
}
