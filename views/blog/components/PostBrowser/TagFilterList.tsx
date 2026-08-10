'use client';

/** 태그 칩 목록 — 데스크톱 사이드바와 모바일 시트가 같은 것을 쓴다 */
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type TagFilterListProps = {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  className?: string;
};

/** 태그를 켜고 끄는 칩 줄을 그린다 — 배치는 className 으로 감싸는 쪽이 정한다 */
export function TagFilterList({
  tags,
  selected,
  onToggle,
  className,
}: TagFilterListProps) {
  return (
    <ul
      aria-label='태그 필터'
      className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => {
        const active = selected.includes(tag);

        return (
          <li key={tag}>
            <Badge
              asChild
              variant={active ? 'default' : 'outline'}>
              <button
                type='button'
                aria-pressed={active}
                className='cursor-pointer'
                onClick={() => {
                  onToggle(tag);
                }}>
                #{tag}
              </button>
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
