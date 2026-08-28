'use client';

import { Button } from '@/views/blog/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/views/blog/components/ui/sheet';
import { TagFilterList } from './TagFilterList';

type TagFilterSheetProps = {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  matchCount: number;
};

/** 좁은 화면용 태그 필터. 아래에서 올라오는 시트로 같은 목록을 보여준다. */
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
          {/* 태그를 누를 때마다 몇 편이 남는지 스크린 리더가 읽어준다 */}
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
