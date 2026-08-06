'use client';

/** 목록 필터 — 조건은 URL 이 갖고, 거르는 일은 filterPosts 에 맡긴다 */
import { filterPosts, type PostListItem } from '@/entities/post';
import { cn } from '@/shared/lib';
import {
  EMPTY_FILTERS,
  useUrlFilters,
  type UrlFilters,
} from '../../lib/useUrlFilters';
import { PostCard } from '../PostCard/PostCard';

/** 시리즈 하나와 그 편수 */
export type SeriesSummary = {
  name: string;
  count: number;
};

const CHIP_CLASS =
  'rounded-full border px-3 py-1 text-body-sm transition-colors duration-quick ease-standard';

/** 발행 글을 검색어·태그·시리즈로 좁혀 보여준다 */
export function PostBrowser({
  posts,
  tags,
  seriesList,
}: {
  posts: PostListItem[];
  tags: string[];
  seriesList: SeriesSummary[];
}) {
  const [filters, setFilters] = useUrlFilters();

  const update = (patch: Partial<UrlFilters>) => {
    setFilters({ ...filters, ...patch });
  };

  const visible = filterPosts(posts, {
    q: filters.q,
    tag: filters.tag || undefined,
    series: filters.series || undefined,
  });
  const hasFilter = Boolean(filters.q || filters.tag || filters.series);

  return (
    <div>
      <div className='flex flex-col gap-6'>
        <div>
          <label
            htmlFor='post-search'
            className='sr-only'>
            글 검색
          </label>
          <input
            id='post-search'
            type='search'
            value={filters.q}
            onChange={(event) => {
              update({ q: event.target.value });
            }}
            placeholder='제목·설명·태그로 검색'
            className='w-full max-w-sm rounded-md border border-border bg-surface px-4 py-2 text-body text-foreground placeholder:text-subtle'
          />
        </div>

        {tags.length > 0 ? (
          <ul
            aria-label='태그 필터'
            className='flex flex-wrap gap-2'>
            {tags.map((tag) => {
              const active = filters.tag === tag;

              return (
                <li key={tag}>
                  <button
                    type='button'
                    aria-pressed={active}
                    onClick={() => {
                      // 켜진 태그를 다시 누르면 조건이 풀린다
                      update({ tag: active ? '' : tag });
                    }}
                    className={cn(
                      CHIP_CLASS,
                      active
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border text-muted hover:border-border-strong'
                    )}>
                    #{tag}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {hasFilter ? (
          <div>
            <button
              type='button'
              onClick={() => {
                setFilters(EMPTY_FILTERS);
              }}
              className='text-body-sm text-muted underline underline-offset-4 hover:text-accent'>
              조건 지우기
            </button>
          </div>
        ) : null}
      </div>

      {/* 연재 묶음은 조건이 없을 때만 — 걸러진 목록 위에 또 두면 같은 글을 두 번 세는 화면이 된다 */}
      {!hasFilter && seriesList.length > 0 ? (
        <section
          aria-labelledby='series-heading'
          className='mt-12'>
          <h2
            id='series-heading'
            className='text-label text-subtle uppercase'>
            연재
          </h2>
          <ul className='mt-4 grid gap-3 sm:grid-cols-2'>
            {seriesList.map((series) => {
              return (
                <li key={series.name}>
                  <button
                    type='button'
                    onClick={() => {
                      update({ series: series.name });
                    }}
                    className='flex w-full items-baseline justify-between gap-4 rounded-md border border-border px-4 py-3 text-start transition-colors duration-quick ease-standard hover:border-border-strong'>
                    <span className='text-body break-keep text-foreground'>
                      {series.name}
                    </span>
                    <span className='shrink-0 text-body-sm text-subtle'>
                      {series.count}편
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section
        aria-labelledby='post-list-heading'
        className='mt-12'>
        <h2
          id='post-list-heading'
          className='text-label text-subtle uppercase'>
          글 {visible.length}편
        </h2>

        {visible.length > 0 ? (
          <div className='mt-4'>
            {visible.map((post) => {
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  onSelectTag={(tag) => {
                    update({ tag });
                  }}
                />
              );
            })}
          </div>
        ) : (
          <p className='mt-6 text-body text-muted'>
            조건에 맞는 글이 없다. 조건을 지우고 다시 찾아보자.
          </p>
        )}
      </section>
    </div>
  );
}
