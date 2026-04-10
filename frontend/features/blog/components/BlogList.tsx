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
  const activeTags = searchParams.get('tags')?.split(',') ?? [];

  const filtered =
    activeTags.length > 0
      ? posts.filter((p) => activeTags.every((tag) => p.tags.includes(tag)))
      : posts;

  if (filtered.length === 0) {
    return <p className={s.emptyText}>해당 태그의 포스트가 없습니다.</p>;
  }

  return (
    <section className={s.grid}>
      {filtered.map((post) => (
        <BlogCard
          key={post.slug}
          post={post}
        />
      ))}
    </section>
  );
}
