import { Mention } from '@/features/blog/components/Mention';
import { TableOfContents } from '@/features/blog/components/TableOfContents';
import { Tooltip } from '@/features/blog/components/Tooltip';
import { extractHeadings } from '@/features/blog/lib/extract-headings';
import { mdxOptions } from '@/features/blog/lib/mdx-options';
import { getPostBySlug, getPostList } from '@/features/blog/lib/posts';
import { SITE_URL } from '@/features/shared/constants';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import * as s from './page.css';

const mdxComponents = { Tooltip, Mention };

// 빌드 시 모든 포스트 slug를 정적 경로로 생성
export function generateStaticParams() {
  return getPostList().map((post) => ({ slug: post.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${slug}`,
      publishedTime: new Date(post.date).toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: '임재준',
      url: SITE_URL,
    },
    url: `${SITE_URL}/blog/${slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <main className={s.main}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className={s.header}>
        <span className={s.date}>{post.date}</span>
        <h1 className={s.title}>{post.title}</h1>
        <p className={s.description}>{post.description}</p>
        {post.tags.length > 0 && (
          <ul className={s.tags}>
            {post.tags.map((tag) => (
              <li
                key={tag}
                className={s.tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className={s.contentLayout}>
        <article className={s.prose}>
          <MDXRemote
            source={post.content}
            options={mdxOptions}
            components={mdxComponents}
          />
        </article>

        {headings.length > 0 && (
          <aside className={s.tocAside}>
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>
    </main>
  );
}
