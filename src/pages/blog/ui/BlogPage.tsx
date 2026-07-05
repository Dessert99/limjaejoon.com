import Link from 'next/link';
import { getPublishedPosts, type PostListItem } from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';
import * as s from './BlogPage.css';

type BlogPageViewProps = {
  posts: PostListItem[];
};

/** 공개 블로그 목록 UI */
export function BlogPageView({ posts }: BlogPageViewProps) {
  return (
    <main className={s.main}>
      <header className={s.header}>
        <p className={s.eyebrow}>Blog</p>
        <h1 className={s.title}>기술 블로그</h1>
      </header>

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
    </main>
  );
}

/** 공개 블로그 목록 페이지 */
export async function BlogPage() {
  const client = createSupabaseStaticClient();
  const posts = await getPublishedPosts(client);

  return <BlogPageView posts={posts} />;
}
