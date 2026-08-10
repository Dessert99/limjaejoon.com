'use client';

/** 목록 필터 — 조건은 URL 이 갖고, 거르는 일은 filterPosts 에 맡긴다 */
import { Fragment } from 'react';
import { filterPosts } from '../../lib/filterPosts';
import { type PostListItem } from '../../lib/post.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  EMPTY_FILTERS,
  useUrlFilters,
  type UrlFilters,
} from '../../lib/useUrlFilters';
import { PostRow } from './PostRow';
import { TagFilterList } from './TagFilterList';
import { TagFilterSheet } from './TagFilterSheet';

type PostBrowserProps = {
  posts: PostListItem[];
  tags: string[];
};

/** 발행 글을 검색어·태그·시리즈로 좁혀 보여준다 */
export function PostBrowser({ posts, tags }: PostBrowserProps) {
  const [filters, setFilters] = useUrlFilters();

  const update = (patch: Partial<UrlFilters>) => {
    setFilters({ ...filters, ...patch });
  };

  /** 켜진 태그는 빼고 꺼진 태그는 더한다 — 남은 태그끼리는 AND 로 겹쳐 목록이 더 좁아진다 */
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
    <div className='grid gap-4 lg:grid-cols-[13rem_1fr] lg:gap-grid-gap'>
      {/* 같은 목록을 폭에 따라 갈아 끼운다 — CSS 로만 갈라야 정적 HTML 한 벌에 태그가 다 남는다 */}
      {tags.length > 0 ? (
        <>
          <aside className='hidden lg:sticky lg:top-8 lg:block lg:self-start'>
            <h2 className='text-label text-muted-foreground uppercase'>태그</h2>
            {/* 태그가 화면보다 길면 여기서만 스크롤한다 — 아니면 아래쪽 태그를 보려고 글 목록을 통째로 내려야 한다 */}
            <TagFilterList
              tags={tags}
              selected={filters.tags}
              onToggle={toggleTag}
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
            className='text-label text-muted-foreground uppercase'>
            글 {visible.length}편
          </h2>

          {hasFilter ? (
            <Button
              variant='link'
              size='sm'
              className='h-auto p-0'
              onClick={() => {
                setFilters(EMPTY_FILTERS);
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
          <p className='mt-6 text-body text-muted-foreground'>
            조건에 맞는 글이 없다. 조건을 지우고 다시 찾아보자.
          </p>
        )}
      </section>
    </div>
  );
}
