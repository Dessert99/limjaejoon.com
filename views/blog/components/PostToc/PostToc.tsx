'use client';

import { useEffect, useState } from 'react';
import type { PostHeading } from '../../lib/extractHeadings';
import { cn } from '@/lib/utils';

const ACTIVE_BAND = '-96px 0px -70% 0px';

function useActiveHeading(headingIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
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

        const current = elements.find((element) => {
          return inBand.get(element.id);
        });

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
