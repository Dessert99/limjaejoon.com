'use client';

import type { TocHeading } from '@/features/blog/lib/extract-headings';
import { useEffect, useRef, useState } from 'react';
import * as s from './TableOfContents.css';

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState('');
  // 클릭 스크롤 중 Observer가 중간 헤딩을 활성화하지 않도록 잠금
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    // 목차가 스크롤되는 중요 로직
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  function handleClick(slug: string) {
    setActiveSlug(slug);
    isClickScrolling.current = true;
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  }

  if (headings.length === 0) return null;

  return (
    <nav
      className={s.nav}
      aria-label='목차'>
      <p className={s.title}>목차</p>
      <ul className={s.list}>
        {headings.map((heading) => (
          <li key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              className={s.link}
              data-active={activeSlug === heading.slug}
              onClick={() => handleClick(heading.slug)}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
