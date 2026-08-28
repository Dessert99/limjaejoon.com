'use client';

import { Fragment } from 'react';
import { filterPosts } from '../../lib/filterPosts';
import { type PostListItem } from '../../lib/post.types';
import { Button } from '@/views/blog/components/ui/button';
import { Input } from '@/views/blog/components/ui/input';
import { Separator } from '@/views/blog/components/ui/separator';
import { useUrlFilters, type UrlFilters } from '../../lib/useUrlFilters';
import { PostRow } from './PostRow';
import { TagFilterList } from './TagFilterList';
import { TagFilterSheet } from './TagFilterSheet';

type PostBrowserProps = {
  posts: PostListItem[];
  tags: string[];
};

/** 글 목록과 검색·태그 필터. 서버가 준 전체 글을 브라우저에서 걸러 보여준다. */
export function PostBrowser({ posts, tags }: PostBrowserProps) {
  const [filters, setFilters] = useUrlFilters();

  const update = (patch: Partial<UrlFilters>) => {
    setFilters({ ...filters, ...patch });
  };

  // 같은 태그를 다시 누르면 조건에서 빠진다
  const toggleTag = (tag: string) => {
    update({
      tags: filters.tags.includes(tag)
        ? filters.tags.filter((current) => {
            return current !== tag;
          })
        : [...filters.tags, tag],
    });
  };

  const visible = filterPosts(posts, { q: filters.q, tags: filters.tags });
  const hasFilter = Boolean(filters.q || filters.tags.length > 0);

  return (
    <div className='grid gap-4 lg:grid-cols-[13rem_1fr] lg:gap-blog-grid-gap'>
      {tags.length > 0 ? (
        <>
          {/* 같은 필터를 넓은 화면은 왼쪽 기둥으로, 좁은 화면은 시트로 보여준다 */}
          <aside className='hidden lg:sticky lg:top-8 lg:block lg:self-start'>
            <h2 className='text-xs tracking-widest text-blog-muted-foreground uppercase'>태그</h2>
            <TagFilterList
              tags={tags}
              selected={filters.tags}
              onToggle={toggleTag}
              // 8rem은 위아래 여백 몫. 줄이면 태그 기둥이 길어져 화면 밖으로 넘친다
              className='mt-4 lg:max-h-[calc(100svh-8rem)] lg:flex-col lg:flex-nowrap lg:items-start lg:overflow-y-auto lg:overscroll-contain lg:pr-2'
            />
          </aside>

          <div className='lg:hidden'>
            <TagFilterSheet
              tags={tags}
              selected={filters.tags}
              onToggle={toggleTag}
              matchCount={visible.length}
            />
          </div>
        </>
      ) : null}

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
          placeholder='제목·설명·태그로 검색'
          className='max-w-sm'
          onChange={(event) => {
            update({ q: event.target.value });
          }}
        />

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
                setFilters({ q: '', tags: [] });
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
                    onSelectTag={toggleTag}
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
    </div>
  );
}
