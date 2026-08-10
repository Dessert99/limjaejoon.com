'use client';

/** 좁은 화면의 태그 필터 — 칩 수십 개가 첫 화면을 다 먹지 않게 시트 뒤로 접는다 */
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

/** 태그를 시트에 담고, 몇 개를 골랐는지만 트리거에 남긴다 */
export function TagFilterSheet({
  tags,
  selected,
  onToggle,
  matchCount,
}: TagFilterSheetProps) {
  return (
    <Sheet>
      {/* asChild 가 없으면 Radix 의 button 안에 Button 의 button 이 겹친다 */}
      <SheetTrigger asChild>
        <Button
          type='button'
          variant='outline'
          size='sm'
          // 눈에는 '태그 1' 로 족하지만 읽어 주면 태그 이름과 헷갈린다
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
          {/* 시트가 목록을 덮어 여기가 유일한 피드백이다 — description 은 열 때 한 번만 읽히니 live 로 둔다 */}
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
