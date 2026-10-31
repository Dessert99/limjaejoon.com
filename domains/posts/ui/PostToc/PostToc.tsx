'use client';

import { useState } from 'react';
import type { PostHeading } from '@/domains/posts/lib/extractHeadings';

import { clsx } from 'clsx';

import { TocList } from './TocList';

import { useActiveHeading } from '@/domains/posts/hooks/useActiveHeading';

/** 글 목차. 넓은 화면에서는 옆에 붙고, 좁은 화면에서는 버튼으로 접힌다. */
export function PostToc({
  headings,
  className,
}: {
  headings: PostHeading[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const activeId = useActiveHeading(
    headings.map((heading) => {
      return heading.id;
    })
  );

  // 제목이 하나도 없는 짧은 글에서 빈 목차 껍데기만 남는 걸 막는다
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label='목차'
      className={className}>
      <button
        type='button'
        aria-expanded={open}
        aria-controls='post-toc-list'
        className='w-full rounded-lg border border-blog-border px-4 py-2 text-start text-sm xl:hidden'
        onClick={() => {
          setOpen((previous) => {
            return !previous;
          });
        }}>
        목차
      </button>

      <p className='hidden text-xs tracking-widest text-blog-muted-foreground uppercase xl:block'>
        목차
      </p>

      <div
        id='post-toc-list'
        className={clsx(
          // 12rem은 내비와 위아래 여백 몫. 줄이면 목차가 길어져 화면 밖으로 넘친다
          'mt-4 xl:max-h-[calc(100svh-12rem)] xl:overflow-y-auto',
          // 넓은 화면에서는 접힘 상태와 무관하게 늘 펼쳐 둔다
          !open && 'hidden xl:block'
        )}>
        <TocList
          headings={headings}
          activeId={activeId}
        />
      </div>
    </nav>
  );
}
