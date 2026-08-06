/** 목차 — 넓은 화면에서는 본문 옆 sticky, 좁은 화면에서는 본문 위에 접어 둔다 */
import type { PostHeading } from '@/entities/post';
import { cn } from '@/shared/lib';

function TocList({ headings }: { headings: PostHeading[] }) {
  return (
    <ol className='space-y-2 text-body-sm'>
      {headings.map((heading) => {
        return (
          <li
            key={heading.id}
            className={cn(heading.depth === 3 && 'ps-4')}>
            <a
              href={`#${heading.id}`}
              className='text-muted transition-colors duration-quick ease-standard hover:text-accent'>
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
  // 제목이 없는 글에 빈 상자를 남기지 않는다
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* 좁은 화면에서는 접어 둔다 — 펼친 채로 두면 본문이 한 화면 밀린다 */}
      <details className='rounded-md border border-border p-4 lg:hidden'>
        <summary className='cursor-pointer text-body-sm text-foreground'>
          목차
        </summary>
        <nav
          aria-label='목차'
          className='mt-4'>
          <TocList headings={headings} />
        </nav>
      </details>

      <nav
        aria-label='목차'
        className='hidden lg:sticky lg:top-24 lg:block'>
        <p className='text-label text-subtle uppercase'>목차</p>
        <div className='mt-4'>
          <TocList headings={headings} />
        </div>
      </nav>
    </div>
  );
}
