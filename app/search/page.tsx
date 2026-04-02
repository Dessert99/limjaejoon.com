import { getAllPostsForSearch } from '@/features/blog/lib/posts';
import { SearchContent } from '@/features/search/components/SearchContent';
import * as s from './search.css';

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
