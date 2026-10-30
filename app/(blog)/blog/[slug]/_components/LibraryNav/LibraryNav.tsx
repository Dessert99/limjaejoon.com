'use client';

import { clsx } from 'clsx';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Tooltip } from 'radix-ui';
import { useState } from 'react';
import type { Book } from '@/domains/books/types/book.types';
import type { PostListItem } from '@/domains/posts/types/post.types';
import { PostLink } from './PostLink';

/** 글 상세 왼쪽의 분류 → 책 → 글 트리. 지금 글의 책만 펼쳐 두고 다른 책은 눌러서 편다. */
export function LibraryNav({
  books,
  posts,
  currentSlug,
  className,
}: {
  books: Book[];
  posts: PostListItem[];
  currentSlug: string;
  className?: string;
}) {
  const currentBook = posts.find((post) => {
    return post.slug === currentSlug;
  })?.book?.slug;
  const [openBooks, setOpenBooks] = useState(() => {
    return new Set(currentBook ? [currentBook] : []);
  });

  // 글 없는 책은 눌러도 갈 곳이 없어 뺀다
  const shelves = books
    .map((book) => {
      return {
        book,
        posts: posts.filter((post) => {
          return post.book?.slug === book.slug;
        }),
      };
    })
    .filter((shelf) => {
      return shelf.posts.length > 0;
    });
  const categories = [
    ...new Set(
      shelves.map((shelf) => {
        return shelf.book.category;
      })
    ),
  ];

  return (
    <nav
      aria-label='서재'
      className={className}>
      {/* 판이 뜨는 지연 0. 올리면 잘린 줄마다 잠깐 멈춰야 펼쳐진다. 줄을 벗어나면 바로 닫는다 */}
      <Tooltip.Provider
        delayDuration={0}
        disableHoverableContent>
        <Link
          href='/library'
          className='text-xs tracking-widest text-blog-muted-foreground transition-colors duration-200 ease-in-out hover:text-blog-foreground'>
          ← 서재
        </Link>

        {categories.map((category) => {
          return (
            <div key={category}>
              <p className='mt-6 text-xs text-blog-muted-foreground'>
                {category}
              </p>
              <ul className='mt-2 space-y-1 text-sm'>
                {shelves
                  .filter((shelf) => {
                    return shelf.book.category === category;
                  })
                  .map(({ book, posts: bookPosts }) => {
                    const open = openBooks.has(book.slug);

                    return (
                      <li key={book.slug}>
                        <button
                          type='button'
                          aria-expanded={open}
                          className={clsx(
                            'flex w-full items-center gap-1.5 py-1 text-start break-keep transition-colors duration-200 ease-in-out hover:text-blog-foreground',
                            book.slug === currentBook
                              ? 'font-medium text-blog-foreground'
                              : 'text-blog-muted-foreground'
                          )}
                          onClick={() => {
                            setOpenBooks((previous) => {
                              const next = new Set(previous);

                              if (!next.delete(book.slug)) {
                                next.add(book.slug);
                              }

                              return next;
                            });
                          }}>
                          <ChevronRightIcon
                            aria-hidden
                            className={clsx(
                              'size-3 shrink-0 transition-transform duration-200 ease-in-out',
                              open && 'rotate-90'
                            )}
                          />
                          <span className='min-w-0'>{book.title}</span>
                          <span className='ms-auto text-xs text-blog-muted-foreground tabular-nums'>
                            {bookPosts.length}
                          </span>
                        </button>

                        {open ? (
                          <ol className='ms-1.5 mt-1 mb-2 space-y-2 border-s border-blog-border ps-3'>
                            {bookPosts.map((post) => {
                              return (
                                <li key={post.slug}>
                                  <PostLink
                                    post={post}
                                    current={post.slug === currentSlug}
                                  />
                                </li>
                              );
                            })}
                          </ol>
                        ) : null}
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
      </Tooltip.Provider>
    </nav>
  );
}
