'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import * as s from './TagSidebar.css';

interface TagSidebarProps {
  tags: string[];
}

export function TagSidebar({ tags }: TagSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // url 파싱
  const activeTags = searchParams.get('tags')?.split(',') ?? []; // 현재 선택된 태그 목록

  // 태그 클릭할 때마다 실행
  const handleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString()); // 현재 URL 쿼리 파라미터 복사

    // 이미 선택된 태그면 제거, 아니면 추가
    const next = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];

    // 선택된 태그가 있으면 정렬해서 URL에 세팅, 없으면 파라미터 삭제
    if (next.length > 0) {
      params.set('tags', next.sort().join(','));
    } else {
      params.delete('tags');
    }

    // 쿼리 스트링을 문자열로 변환 (예: "tags=React,TypeScript")
    const query = params.toString();
    // 쿼리가 있으면 붙여서 이동, 없으면 /blog로 이동
    router.push(query ? `/blog?${query}` : '/blog');
  };

  return (
    <aside className={s.sidebar}>
      <p className={s.label}>태그</p>
      <ul className={s.list}>
        <li>
          <button
            className={s.tagButton}
            data-active={activeTags.length === 0}
            onClick={() => router.push('/blog')}>
            전체
          </button>
        </li>
        {tags.map((tag) => (
          <li key={tag}>
            <button
              className={s.tagButton}
              data-active={activeTags.includes(tag)}
              onClick={() => handleTag(tag)}>
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
