'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TagFilterList } from './TagFilterList';

type TagFilterSheetProps = {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  matchCount: number;
};

export function TagFilterSheet({
  tags,
  selected,
  onToggle,
  matchCount,
}: TagFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type='button'
          variant='outline'
          size='sm'
          aria-label={
            selected.length > 0 ? `태그 ${selected.length}개 고름` : undefined
          }>
          태그
          {selected.length > 0 ? <span>{selected.length}</span> : null}
        </Button>
      </SheetTrigger>

      <SheetContent
        side='bottom'
        className='max-h-[80svh]'>
        <SheetHeader>
          <SheetTitle>태그</SheetTitle>
          <SheetDescription aria-live='polite'>
            글 {matchCount}편
          </SheetDescription>
        </SheetHeader>

        <TagFilterList
          tags={tags}
          selected={selected}
          onToggle={onToggle}
          className='min-h-0 flex-1 overflow-y-auto px-4 pb-4'
        />
      </SheetContent>
    </Sheet>
  );
}
