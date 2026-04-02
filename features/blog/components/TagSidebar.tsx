'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as s from './TagSidebar.css';

interface TagSidebarProps {
  tags: string[];
}

export function TagSidebar({ tags }: TagSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag') ?? undefined;

  const handleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeTag === tag) {
      params.delete('tag'); // 같은 태그 재클릭 → 필터 해제
    } else {
      params.set('tag', tag);
    }
    const query = params.toString();
    router.push(query ? `/blog?${query}` : '/blog');
  };

  return (
    <aside className={s.sidebar}>
      <p className={s.label}>태그</p>
      <ul className={s.list}>
        <li>
          <button
            className={s.tagButton}
            data-active={!activeTag}
            onClick={() => router.push('/blog')}>
            전체
          </button>
        </li>
        {tags.map((tag) => (
          <li key={tag}>
            <button
              className={s.tagButton}
              data-active={activeTag === tag}
              onClick={() => handleTag(tag)}>
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
