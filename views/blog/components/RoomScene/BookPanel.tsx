'use client';

import { Fragment } from 'react';
import type { Book } from '../../lib/book.types';
import { type PostListItem } from '../../lib/post.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/views/blog/components/ui/dialog';
import { Separator } from '@/views/blog/components/ui/separator';
import { PostRow } from './PostRow';

/** 방에서 연 책의 글 목록. 책 앞 가운데에 카드로 떠서 페이지를 떠나지 않고 글을 고른다. */
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
    <Dialog
      open={Boolean(book)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}>
      {/* 위아래 화면 높이 10%씩 비워 방이 보이게 한다. 좁은 화면은 gutter만 남기고, 1280부터는 화면의 80%로 같은 비율을 유지한다 */}
      <DialogContent className='top-[10%] bottom-[10%] flex w-[calc(100%-2*var(--spacing-blog-gutter))] max-w-none translate-y-0 flex-col gap-0 p-0 sm:max-w-none xl:w-[80vw]'>
        <DialogHeader className='border-b border-blog-border p-6 text-left'>
          <DialogTitle>{book?.title}</DialogTitle>
          <DialogDescription>글 {posts.length}편</DialogDescription>
        </DialogHeader>

        <div className='min-h-0 flex-1 overflow-y-auto px-6 pb-6'>
          {posts.length > 0 ? (
            posts.map((post, index) => {
              return (
                <Fragment key={post.id}>
                  {index > 0 ? <Separator /> : null}
                  <PostRow post={post} />
                </Fragment>
              );
            })
          ) : (
            <p className='pt-6 text-base text-blog-muted-foreground'>
              아직 이 책에 쓴 글이 없다.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
