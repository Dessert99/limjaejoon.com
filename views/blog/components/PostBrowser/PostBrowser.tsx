'use client';

import { Fragment } from 'react';
import type { BookRef } from '../../lib/book.types';
import { filterPosts } from '../../lib/filterPosts';
import { type PostListItem } from '../../lib/post.types';
import { Badge } from '@/views/blog/components/ui/badge';
import { Button } from '@/views/blog/components/ui/button';
import { Input } from '@/views/blog/components/ui/input';
import { Separator } from '@/views/blog/components/ui/separator';
import { useUrlFilters, type UrlFilters } from '../../lib/useUrlFilters';
import { PostRow } from './PostRow';

type PostBrowserProps = {
  posts: PostListItem[];
  books: BookRef[];
};

/** 글 목록과 검색·책 필터. 서버가 준 전체 글을 브라우저에서 걸러 보여준다. */
export function PostBrowser({ posts, books }: PostBrowserProps) {
  const [filters, setFilters] = useUrlFilters();

  const update = (patch: Partial<UrlFilters>) => {
    setFilters({ ...filters, ...patch });
  };

  // 같은 책을 다시 누르면 조건에서 빠진다
  const toggleBook = (slug: string) => {
    update({ book: filters.book === slug ? '' : slug });
  };

  const visible = filterPosts(posts, { q: filters.q, book: filters.book });
  const hasFilter = Boolean(filters.q || filters.book);

  return (
    <section aria-labelledby='post-list-heading'>
      <label
        htmlFor='post-search'
        className='sr-only'>
        글 검색
      </label>
      <Input
        id='post-search'
        type='search'
        value={filters.q}
        placeholder='제목·설명·책으로 검색'
        className='max-w-sm'
        onChange={(event) => {
          update({ q: event.target.value });
        }}
      />

      {books.length > 0 ? (
        <ul
          aria-label='책 필터'
          className='mt-4 flex flex-wrap gap-2'>
          {books.map((book) => {
            const active = filters.book === book.slug;

            return (
              <li key={book.slug}>
                <Badge
                  asChild
                  variant={active ? 'default' : 'outline'}>
                  <button
                    type='button'
                    aria-pressed={active}
                    className='cursor-pointer'
                    onClick={() => {
                      toggleBook(book.slug);
                    }}>
                    {book.title}
                  </button>
                </Badge>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className='mt-8 flex items-baseline justify-between gap-4'>
        <h2
          id='post-list-heading'
          className='text-xs tracking-widest text-blog-muted-foreground uppercase'>
          글 {visible.length}편
        </h2>

        {hasFilter ? (
          <Button
            variant='link'
            size='sm'
            className='h-auto p-0'
            onClick={() => {
              setFilters({ q: '', book: '' });
            }}>
            조건 지우기
          </Button>
        ) : null}
      </div>

      {visible.length > 0 ? (
        <div className='mt-4'>
          {visible.map((post) => {
            return (
              <Fragment key={post.id}>
                <Separator />
                <PostRow
                  post={post}
                  onSelectBook={toggleBook}
                />
              </Fragment>
            );
          })}
        </div>
      ) : (
        <p className='mt-6 text-base text-blog-muted-foreground'>
          조건에 맞는 글이 없다. 조건을 지우고 다시 찾아보자.
        </p>
      )}
    </section>
  );
}
