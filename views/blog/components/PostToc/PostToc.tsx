'use client';

import { useEffect, useState } from 'react';
import type { PostHeading } from '../../lib/extractHeadings';
import { clsx } from 'clsx';

/** 지금 화면 위쪽에 들어온 제목을 골라 목차에서 짚어준다. */
function useActiveHeading(headingIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  // 배열은 렌더마다 새 참조라 문자열로 눌러야 옵저버가 매번 다시 붙지 않는다
  const key = headingIds.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => {
        return document.getElementById(id);
      })
      .filter((element): element is HTMLElement => {
        return element !== null;
      });

    if (elements.length === 0) {
      return;
    }

    const inBand = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inBand.set(entry.target.id, entry.isIntersecting);
        });

        // 밴드 안에 여러 제목이 겹치면 본문 순서상 가장 위의 것을 잡는다
        const current = elements.find((element) => {
          return inBand.get(element.id);
        });

        if (current) {
          setActiveId(current.id);
        }
      },
      // 화면 위 96px(내비 높이)부터 아래 30%까지만 감지 밴드다. 밴드를 넓히면 여러 제목이 겹쳐 잡힌다
      { rootMargin: '-96px 0px -70% 0px' }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [key]);

  return activeId;
}

/** 목차 항목들. h3은 한 단 들여 h2 아래임을 보인다. */
function TocList({
  headings,
  activeId,
}: {
  headings: PostHeading[];
  activeId: string | null;
}) {
  return (
    <ol className='space-y-2 text-sm'>
      {headings.map((heading) => {
        const active = heading.id === activeId;

        return (
          <li
            key={heading.id}
            className={heading.depth === 3 ? 'ps-4' : undefined}>
            <a
              href={`#${heading.id}`}
              aria-current={active ? 'location' : undefined}
              className={clsx(
                'block break-keep transition-colors duration-200 ease-in-out',
                active
                  ? 'text-blog-primary'
                  : 'text-blog-muted-foreground hover:text-blog-foreground'
              )}>
              {heading.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

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
