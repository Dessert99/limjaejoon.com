import { Mention } from '@/features/blog/components/Mention';
import { TableOfContents } from '@/features/blog/components/TableOfContents';
import { Tooltip } from '@/features/blog/components/Tooltip';
import { extractHeadings } from '@/features/blog/lib/extract-headings';
import { mdxOptions } from '@/features/blog/lib/mdx-options';
import { getStoryBySlug, getStoryList } from '@/features/blog/lib/posts';
import { SITE_URL } from '@/features/shared/constants';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import * as s from './page.css';

export function generateStaticParams() {
  return getStoryList().map((story) => ({ slug: story.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) return {};

  return {
    title: story.title,
    description: story.description,
    keywords: story.tags,
    openGraph: {
      type: 'article',
      title: story.title,
      description: story.description,
      url: `${SITE_URL}/stories/${slug}`,
      publishedTime: new Date(story.date).toISOString(),
      tags: story.tags,
    },
    twitter: {
      card: 'summary',
      title: story.title,
      description: story.description,
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const headings = extractHeadings(story.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.description,
    datePublished: story.date,
    author: {
      '@type': 'Person',
      name: '임재준',
      url: SITE_URL,
    },
    url: `${SITE_URL}/stories/${slug}`,
    keywords: story.tags.join(', '),
  };

  return (
    <main className={s.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className={s.header}>
        <span className={s.date}>{story.date}</span>
        <h1 className={s.title}>{story.title}</h1>
        <p className={s.description}>{story.description}</p>
        {story.tags.length > 0 && (
          <ul className={s.tags}>
            {story.tags.map((tag) => (
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
            source={story.content}
            options={mdxOptions}
            components={{ Tooltip, Mention }}
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
