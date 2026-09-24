'use client';

import { XIcon } from 'lucide-react';
import { type CSSProperties } from 'react';
import type { Book } from '../../lib/book.types';
import { type PostListItem } from '../../lib/post.types';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/views/blog/components/ui/dialog';
import { PostCard } from './PostCard';

/** 방에서 연 책의 모달. 바탕을 책 색으로 칠하고 그 책의 로고를 워터마크로 깔아 날아온 책과 잇는다. */
export function BookModal({
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
      {/* 글자는 크림색. 책 색은 이 색과 대비 3:1 이상으로 맞춰 둬서 바탕이 책마다 달라도 읽힌다 */}
      {/* 색을 style로 주는 건 cn이 text-blog-* 를 글자 크기로 분류해 text-[색] 클래스로는 기본 글자색을 못 덮어서다 */}
      <DialogContent
        showCloseButton={false}
        style={
          {
            backgroundColor: book?.color,
            color: '#f5f1e8',
            // 글 카드가 올렸을 때 번질 책 색. 카드에 책을 따로 넘기지 않고 이 변수로 물려받는다
            '--book': book?.color,
          } as CSSProperties
        }
        className='top-[10%] bottom-[10%] flex w-[calc(100%-2*var(--spacing-blog-gutter))] max-w-none translate-y-0 flex-col gap-0 overflow-hidden border-0 p-0 sm:max-w-none xl:w-[80vw]'>
        <DialogHeader className='p-6 text-left'>
          <DialogTitle>{book?.title}</DialogTitle>
          <DialogDescription style={{ color: 'rgb(245 241 232 / 0.7)' }}>
            글 {posts.length}편
          </DialogDescription>
        </DialogHeader>

        <div className='relative min-h-0 flex-1'>
          {book?.logo ? (
            // 로고 워터마크. 불투명도를 올리면 로고가 글 목록과 다투고, 폭을 키우면 카드를 넘어가 잘린다
            <div
              aria-hidden
              className='pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(60%,28rem)] -translate-1/2 bg-[#f5f1e8] opacity-10'
              style={{
                maskImage: `url(/images/logos/${book.logo}.svg)`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }}
            />
          ) : null}

          {/* 워터마크는 제자리에 두고 목록만 스크롤한다. 폰 1열, 768부터 2열, 모달이 화면 80%가 되는 1280부터 3열 */}
          <div className='relative h-full overflow-y-auto px-6 pb-6'>
            {posts.length > 0 ? (
              <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {posts.map((post) => {
                  return (
                    <li key={post.id}>
                      <PostCard post={post} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className='text-base opacity-70'>아직 이 책에 쓴 글이 없다.</p>
            )}
          </div>
        </div>

        <DialogClose className='absolute top-5 right-5 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#f5f1e8]'>
          <XIcon className='size-5' />
          <span className='sr-only'>닫기</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
