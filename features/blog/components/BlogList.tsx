'use client';

import { useSearchParams } from 'next/navigation';
import type { PostMeta } from '@/features/blog/types';
import { BlogCard } from './BlogCard';
import * as s from './BlogList.css';

interface BlogListProps {
  posts: PostMeta[];
}

export function BlogList({ posts }: BlogListProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag') ?? undefined;

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  if (filtered.length === 0) {
    return <p className={s.emptyText}>해당 태그의 포스트가 없습니다.</p>;
  }

  return (
    <section className={s.grid}>
      {filtered.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </section>
  );
}
