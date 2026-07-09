import Link from 'next/link';
import {
  getPublishedPosts,
  type PostListItem,
  type PostSearchParams,
} from '@/entities/post';
import {
  parsePostSearchParams,
  PostFilterForm,
  type PostFilterOption,
} from '@/features/post-filter';
import { createSupabaseStaticClient } from '@/shared/api';
import * as s from './BlogPage.css';

type BlogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type BlogPageViewProps = {
  posts: PostListItem[];
  filters?: PostSearchParams;
};

const toFilterOptions = (
  values: Array<string | null | undefined>
): PostFilterOption[] => {
  return Array.from(
    new Set(
      values.filter((value): value is string => {
        return Boolean(value);
      })
    )
  ).map((value) => {
    return { label: value, value };
  });
};

/** 공개 블로그 목록 UI */
export function BlogPageView({ posts, filters = {} }: BlogPageViewProps) {
  const categoryOptions = toFilterOptions(
    posts.map((post) => {
      return post.category;
    })
  );
  const seriesOptions = toFilterOptions(
    posts.map((post) => {
      return post.series;
    })
  );

  return (
    <main className={s.main}>
      <header className={s.header}>
        <p className={s.eyebrow}>Blog</p>
        <h1 className={s.title}>기술 블로그</h1>
      </header>

      <PostFilterForm
        categoryOptions={categoryOptions}
        filters={filters}
        seriesOptions={seriesOptions}
      />

      {posts.length === 0 ? (
        <p
          className={s.empty}
          role='status'>
          조건에 맞는 글이 없습니다.
        </p>
      ) : (
        <section
          aria-label='게시글 목록'
          className={s.list}>
          {posts.map((post) => {
            return (
              <article
                className={s.item}
                key={post.id}>
                <h2 className={s.itemTitle}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className={s.description}>{post.description}</p>
                <div className={s.meta}>
                  {post.published_at ? (
                    <time dateTime={post.published_at}>
                      {post.published_at.slice(0, 10)}
                    </time>
                  ) : null}
                  {post.tags.map((tag) => {
                    return <span key={tag}>{tag}</span>;
                  })}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

/** 공개 블로그 목록 페이지 */
export async function BlogPage({ searchParams }: BlogPageProps) {
  const client = createSupabaseStaticClient();
  const filters = parsePostSearchParams((await searchParams) ?? {});
  const posts = await getPublishedPosts(client, filters);

  return (
    <BlogPageView
      filters={filters}
      posts={posts}
    />
  );
}
