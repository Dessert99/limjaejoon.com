'use client';

// /blog 의 결과 리스트. URL의 ?tags=·?q= 를 읽어 filterPosts로 한 번에 거른다
// (검색창 SearchBox·태그 TagSidebar는 URL에만 쓰고, 실제 필터는 여기 한곳).
import type { PostMeta } from '@/features/blog/types';
import { filterPosts } from '@/features/blog/lib/filter-posts';
import { useSearchParams } from 'next/navigation';
import { BlogCard } from '@/features/blog/components/BlogCard/BlogCard';
import * as s from './BlogList.css';

interface BlogListProps {
  posts: PostMeta[];
}

export function BlogList({ posts }: BlogListProps) {
  const searchParams = useSearchParams();
  // URL → 필터 입력: tags(콤마 구분, 없으면 []), q(없으면 '')
  const activeTags = searchParams.get('tags')?.split(',') ?? [];
  const query = searchParams.get('q') ?? '';

  const filtered = filterPosts(posts, { tags: activeTags, query });

  if (filtered.length === 0) {
    return <p className={s.emptyText}>조건에 맞는 글이 없습니다.</p>;
  }

  return (
    <section className={s.grid}>
      {filtered.map((post) => {
        return (
          <BlogCard
            key={post.slug}
            post={post}
          />
        );
      })}
    </section>
  );
}
