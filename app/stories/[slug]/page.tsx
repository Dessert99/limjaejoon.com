import { Mention } from '@/features/blog/components/Mention';
import { Tooltip } from '@/features/blog/components/Tooltip';
import { mdxOptions } from '@/features/blog/lib/mdx-options';
import { getStoryBySlug, getStoryList } from '@/features/blog/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import * as s from './page.css';

export function generateStaticParams() {
  return getStoryList().map((story) => ({ slug: story.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <main className={s.main}>
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

      <article className={s.prose}>
        <MDXRemote
          source={story.content}
          options={mdxOptions}
          components={{ Tooltip, Mention }}
        />
      </article>
    </main>
  );
}
