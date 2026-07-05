import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getPublishedPostBySlug,
  getPublishedPostSlugs,
  type Post,
} from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';
import * as s from './BlogPostPage.css';

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type BlogPostPageViewProps = {
  post: Post;
};

const getStaticPublishedPost = async (slug: string): Promise<Post | null> => {
  const client = createSupabaseStaticClient();

  return getPublishedPostBySlug(client, slug);
};

/** 공개 블로그 상세 UI */
export async function BlogPostPageView({ post }: BlogPostPageViewProps) {
  const content = await MDXRemote({ source: post.content_markdown });

  return (
    <main className={s.main}>
      <article>
        <header className={s.header}>
          <Link
            className={s.backLink}
            href='/blog'>
            블로그 목록
          </Link>
          <h1 className={s.title}>{post.title}</h1>
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
        </header>
        <div className={s.content}>{content}</div>
      </article>
    </main>
  );
}

/** 공개 블로그 상세 페이지 */
export async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getStaticPublishedPost(slug);

  if (!post) {
    notFound();
  }

  return BlogPostPageView({ post });
}

/** published 글 상세의 정적 경로를 생성한다 */
export async function generateStaticParams() {
  const client = createSupabaseStaticClient();
  const slugs = await getPublishedPostSlugs(client);

  return slugs.map((slug) => {
    return { slug };
  });
}

/** published 글 상세의 SEO 메타데이터를 생성한다 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getStaticPublishedPost(slug);

  if (!post) {
    return {
      title: '글을 찾을 수 없습니다',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      tags: post.tags,
    },
  };
}
