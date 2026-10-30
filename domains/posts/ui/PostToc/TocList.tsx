import { clsx } from 'clsx';
import type { PostHeading } from '@/domains/posts/lib/extractHeadings';

/** 목차 항목들. h3은 한 단 들여 h2 아래임을 보인다. */
export function TocList({
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
