'use client';

/** 목차 — 넓은 화면에서는 본문 옆 sticky, 좁은 화면에서는 접어 둔다 */
import { useEffect, useState } from 'react';
import type { PostHeading } from '../../lib/extractHeadings';
import { cn } from '@/lib/utils';

// 화면 위쪽에 얇은 띠를 만든다 — 아래를 70% 깎지 않으면 화면 끝에 걸친 먼 제목까지 후보가 된다
const ACTIVE_BAND = '-96px 0px -70% 0px';

/** 지금 읽는 절의 id — 판정은 우리가 하고 IntersectionObserver 는 계기만 준다 */
function useActiveHeading(headingIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  // 배열은 렌더마다 새 참조라 effect 재실행 조건으로 못 쓴다 — 내용이 같으면 같은 문자열로 눌러 둔다
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

        // elements 는 문서 순서다 — 여럿이 동시에 들면 가장 위가 방금 지나온 절이다
        const current = elements.find((element) => {
          return inBand.get(element.id);
        });

        // 띠가 비는 순간(긴 절 한가운데)에는 직전 값을 둔다 — 지우면 스크롤 중에 표시가 깜빡인다
        if (current) {
          setActiveId(current.id);
        }
      },
      { rootMargin: ACTIVE_BAND }
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

function TocList({
  headings,
  activeId,
}: {
  headings: PostHeading[];
  activeId: string | null;
}) {
  return (
    <ol className='space-y-2 text-body-sm'>
      {headings.map((heading) => {
        const active = heading.id === activeId;

        return (
          <li
            key={heading.id}
            className={cn(heading.depth === 3 && 'ps-4')}>
            <a
              href={`#${heading.id}`}
              // location 이다 — 같은 문서 안의 현재 위치를 뜻하고, page 는 다른 라우트를 가리킬 때 쓴다
              aria-current={active ? 'location' : undefined}
              className={cn(
                'block break-keep transition-colors duration-quick ease-standard',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}>
              {heading.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** 본문 제목 목록을 앵커 링크로 그린다 */
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

  // 제목이 없는 글에 빈 상자를 남기지 않는다
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label='목차'
      className={className}>
      {/* 여닫기는 좁은 화면 전용이다 — lg 부터는 버튼이 사라지고 목록이 늘 펼쳐져 있다 */}
      <button
        type='button'
        aria-expanded={open}
        aria-controls='post-toc-list'
        className='w-full rounded-md border border-border px-4 py-2 text-start text-body-sm lg:hidden'
        onClick={() => {
          setOpen((previous) => {
            return !previous;
          });
        }}>
        목차
      </button>

      <p className='hidden text-label text-muted-foreground uppercase lg:block'>
        목차
      </p>

      {/* 목차 하나가 51줄까지 가는 글이 있다 — 사이드바가 화면을 넘기지 않게 안에서 스크롤시킨다 */}
      <div
        id='post-toc-list'
        className={cn(
          'mt-4 lg:max-h-[calc(100svh-12rem)] lg:overflow-y-auto',
          !open && 'hidden lg:block'
        )}>
        <TocList
          headings={headings}
          activeId={activeId}
        />
      </div>
    </nav>
  );
}
