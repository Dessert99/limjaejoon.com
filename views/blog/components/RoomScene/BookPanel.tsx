'use client';

import { Fragment } from 'react';
import type { Book } from '../../lib/book.types';
import { type PostListItem } from '../../lib/post.types';
import { Separator } from '@/views/blog/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/views/blog/components/ui/sheet';
import { PostRow } from './PostRow';

/** 방에서 연 책의 글 목록. 방 위에 오른쪽 시트로 떠서 페이지를 떠나지 않고 글을 고른다. */
export function BookPanel({
  book,
  posts,
  onClose,
}: {
  book: Book | undefined;
  posts: PostListItem[];
  onClose: () => void;
}) {
  return (
    <Sheet
      open={Boolean(book)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}>
      <SheetContent side='right'>
        <SheetHeader>
          <SheetTitle>{book?.title}</SheetTitle>
          <SheetDescription>글 {posts.length}편</SheetDescription>
        </SheetHeader>

        <div className='min-h-0 flex-1 overflow-y-auto px-4 pb-4'>
          {posts.length > 0 ? (
            posts.map((post) => {
              return (
                <Fragment key={post.id}>
                  <Separator />
                  <PostRow post={post} />
                </Fragment>
              );
            })
          ) : (
            <p className='text-base text-blog-muted-foreground'>
              아직 이 책에 쓴 글이 없다.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
