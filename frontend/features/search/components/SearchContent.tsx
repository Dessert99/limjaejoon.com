'use client';

import { BlogCard } from '@/features/blog/components/BlogCard';
import type { SearchablePost } from '@/features/blog/types';
import { useDeferredValue, useState } from 'react';
import * as s from './SearchContent.css';

interface SearchContentProps {
  posts: SearchablePost[];
}

export function SearchContent({ posts }: SearchContentProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const deferredTrimmed = deferredQuery.trim();
  const results =
    deferredTrimmed.length > 0 ? filterAndSort(posts, deferredTrimmed) : [];

  return (
    <div>
      <input
        className={s.input}
        type='search'
        placeholder='제목, 설명, 태그로 검색...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label='블로그 검색'
        autoFocus
      />

      {query.trim().length === 0 ? (
        <p className={s.emptyText}>검색어를 입력해 주세요.</p>
      ) : results.length === 0 ? (
        <p className={s.emptyText}>검색 결과가 없습니다.</p>
      ) : (
        <section className={s.results}>
          {results.map((post) => (
            <BlogCard
              key={post.href}
              post={post}
              href={post.href}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function filterAndSort(
  posts: SearchablePost[],
  query: string
): SearchablePost[] {
  const q = query.toLowerCase();

  return posts
    .flatMap((post) => {
      const titleMatch = post.title.toLowerCase().includes(q);
      const descMatch = post.description.toLowerCase().includes(q);
      const tagMatch = post.tags.some((tag) => tag.toLowerCase().includes(q));

      if (!titleMatch && !descMatch && !tagMatch) return [];

      const priority = titleMatch ? 1 : descMatch ? 2 : 3;
      return [{ post, priority }];
    })
    .toSorted((a, b) => a.priority - b.priority)
    .map((item) => item.post);
}
