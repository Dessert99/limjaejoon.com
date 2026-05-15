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
    // 본문에 렌더된 헤딩 요소들을 문서 순서(위→아래)대로 수집
    const elements = headings
      .map((h) => {
        return document.getElementById(h.slug);
      })
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) {
      return;
    }

    // 읽기 기준선: 헤딩 scroll-margin-top(5rem=80px)·고정 헤더와 맞춘 화면 상단 오프셋
    const READING_LINE = 88;

    // 활성 = 기준선을 이미 지나친(위로 올라간) 헤딩 중 가장 마지막 것.
    // "좁은 띠 안에 있을 때만" 방식과 달리, 페이지 끝에 닿으면 마지막 헤딩이
    // 자연히 활성으로 남아 마지막 섹션이 누락되지 않는다.
    function syncActive() {
      // 클릭 점프로 부드럽게 스크롤되는 동안엔 중간 헤딩으로 깜빡이지 않도록 건너뜀
      if (isClickScrolling.current) {
        return;
      }
      // 아직 아무 헤딩도 안 지났으면 ''(도입부) — 비활성 상태 유지
      let current = '';
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= READING_LINE) {
          current = el.id;
        }
      }
      setActiveSlug(current);
    }

    // 새로고침·딥링크 진입 시 현재 스크롤 위치 기준으로 1회 계산
    syncActive();
    window.addEventListener('scroll', syncActive, { passive: true });
    window.addEventListener('resize', syncActive);

    return () => {
      window.removeEventListener('scroll', syncActive);
      window.removeEventListener('resize', syncActive);
    };
  }, [headings]);

  // 스크롤 스파이가 정한 activeSlug를 본문 섹션 배경에 그대로 반영.
  // 관찰자를 새로 두지 않고 이 단일 출처를 공유해 TOC 강조와 섹션 강조가 어긋나지 않게 함.
  useEffect(() => {
    // rehype-section-wrap이 만든 <section data-heading-section="slug"> 들을 훑어 활성 1개만 표시
    const sections = document.querySelectorAll<HTMLElement>(
      '[data-heading-section]'
    );
    for (const el of sections) {
      el.dataset.active = String(el.dataset.headingSection === activeSlug);
    }
  }, [activeSlug]);

  function handleClick(slug: string) {
    setActiveSlug(slug);
    isClickScrolling.current = true;
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  }

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={s.nav}
      aria-label='목차'>
      <p className={s.title}>목차</p>
      <ul className={s.list}>
        {headings.map((heading) => {
          return (
            <li key={heading.slug}>
              <a
                href={`#${heading.slug}`}
                className={s.link}
                data-active={activeSlug === heading.slug}
                onClick={() => {
                  return handleClick(heading.slug);
                }}>
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
