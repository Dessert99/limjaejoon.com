'use client';

/** 글의 태그 선택 — 등록된 것만 고른다. 새로 필요하면 옆의 관리 모달에서 만든다 */
import type { TagWithUsage } from '@/entities/tag';
import { TagManagerDialog } from '@/features/manage-tag';
import { Badge, Label } from '@/shared/ui';

type TagPickerProps = {
  tags: TagWithUsage[];
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  onTagsChange: (tags: TagWithUsage[]) => void;
};

export function TagPicker({
  tags,
  selected,
  onSelectedChange,
  onTagsChange,
}: TagPickerProps) {
  const toggle = (id: string) => {
    onSelectedChange(
      selected.includes(id)
        ? selected.filter((current) => {
            return current !== id;
          })
        : [...selected, id]
    );
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between gap-4'>
        <Label asChild>
          <span id='post-tags-label'>태그</span>
        </Label>
        <TagManagerDialog
          tags={tags}
          onTagsChange={onTagsChange}
        />
      </div>

      {tags.length > 0 ? (
        <ul
          aria-labelledby='post-tags-label'
          className='flex flex-wrap gap-2'>
          {tags.map((tag) => {
            const active = selected.includes(tag.id);

            return (
              <li key={tag.id}>
                <Badge
                  asChild
                  variant={active ? 'default' : 'outline'}>
                  <button
                    type='button'
                    aria-pressed={active}
                    className='cursor-pointer'
                    onClick={() => {
                      toggle(tag.id);
                    }}>
                    #{tag.name}
                  </button>
                </Badge>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className='text-body-sm text-muted-foreground'>
          등록된 태그가 없다. 태그 관리에서 하나 만들어야 글을 저장할 수 있다.
        </p>
      )}
    </div>
  );
}
