'use client';

import type { Book } from '../../../lib/book.types';
import type { PostKind } from '../../../lib/post.types';
import { Label } from '@/views/blog/components/ui/label';

type BookPickerProps = {
  books: Book[];
  kind: PostKind;
  bookId: string;
  onKindChange: (kind: PostKind) => void;
  onBookChange: (id: string) => void;
};

/** 글의 갈래와 책을 고른다. 개념 정리는 책 한 권이 필수고, 이야기는 책을 고르지 않는다. */
export function BookPicker({
  books,
  kind,
  bookId,
  onKindChange,
  onBookChange,
}: BookPickerProps) {
  const categories = [
    ...new Set(
      books.map((book) => {
        return book.category;
      })
    ),
  ];

  return (
    <div className='flex flex-col gap-2'>
      <Label asChild>
        <span id='post-kind-label'>갈래</span>
      </Label>
      <div
        role='radiogroup'
        aria-labelledby='post-kind-label'
        className='flex gap-4 text-sm'>
        {(
          [
            ['concept', '개념 정리'],
            ['story', '이야기'],
          ] as const
        ).map(([value, label]) => {
          return (
            <label
              key={value}
              className='flex cursor-pointer items-center gap-2'>
              <input
                type='radio'
                name='post-kind'
                value={value}
                checked={kind === value}
                onChange={() => {
                  onKindChange(value);
                }}
              />
              {label}
            </label>
          );
        })}
      </div>

      {kind === 'concept' ? (
        <>
          <Label htmlFor='post-book'>책</Label>
          <select
            id='post-book'
            value={bookId}
            onChange={(event) => {
              onBookChange(event.target.value);
            }}
            className='h-9 rounded-md border border-blog-input bg-transparent px-3 text-sm'>
            <option value=''>책을 고른다</option>
            {categories.map((category) => {
              return (
                <optgroup
                  key={category}
                  label={category}>
                  {books
                    .filter((book) => {
                      return book.category === category;
                    })
                    .map((book) => {
                      return (
                        <option
                          key={book.id}
                          value={book.id}>
                          {book.title}
                        </option>
                      );
                    })}
                </optgroup>
              );
            })}
          </select>
        </>
      ) : null}
    </div>
  );
}
