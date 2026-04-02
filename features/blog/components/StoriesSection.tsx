'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import type { PostMeta } from '@/features/blog/types';
import { TagGrid } from './TagGrid';
import * as s from './StoriesSection.css';

interface StoriesSectionProps {
  stories: PostMeta[];
  tags: string[];
}

export function StoriesSection({ stories, tags }: StoriesSectionProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const handleTag = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
      return;
    }
    setActiveTag(tag);
    requestAnimationFrame(() => {
      cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const filtered = activeTag
    ? stories.filter((story) => story.tags.includes(activeTag))
    : [];

  return (
    <section className={s.section}>
      <div className={s.header}>
        <h2 className={s.title}>나의 이야기</h2>
        <p className={s.description}>
          개발하며 겪은 경험과 성장의 기록입니다. 관심 있는 주제를 선택해 보세요.
        </p>
      </div>

      <TagGrid tags={tags} activeTag={activeTag} onTagSelect={handleTag} />

      {filtered.length > 0 && (
        <div ref={cardsRef} className={s.cards}>
          {filtered.map((story) => (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className={s.storyCard}
            >
              <span className={s.storyTitle}>{story.title}</span>
              <span className={s.storyDate}>{story.date}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
