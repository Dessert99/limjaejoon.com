'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type TagFilterListProps = {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  className?: string;
};

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
