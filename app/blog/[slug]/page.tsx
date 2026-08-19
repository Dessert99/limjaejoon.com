import { Badge } from '@/views/blog/components/ui/badge';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { PostAdminActions } from '@/views/blog/components/PostAdminActions/PostAdminActions';
import { PostContent } from '@/views/blog/components/PostContent';
import { PostJsonLd } from '@/views/blog/components/PostJsonLd';
import { PostNav } from '@/views/blog/components/PostNav/PostNav';
import { PostToc } from '@/views/blog/components/PostToc/PostToc';
import { extractHeadings } from '@/views/blog/lib/extractHeadings';
import { formatPublishedAt } from '@/views/blog/lib/formatPublishedAt';
import { pickAdjacentPosts } from '@/views/blog/lib/pickAdjacentPosts';
import {
  getPostBySlug,
  getPostSlugs,
  getPosts,
} from '@/views/blog/server/posts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

const COLUMN = 'max-w-[54rem]';

const loadPost = cache(async (slug: string) => {
  return getPostBySlug(createSupabaseStaticClient(), slug);
});

const loadPublishedPosts = cache(async () => {
  return getPosts(createSupabaseStaticClient());
});

export const generateStaticParams = async () => {
  const slugs = await getPostSlugs(createSupabaseStaticClient());

  return slugs.map((slug) => {
    return { slug };
  });
};

export const generateMetadata = async (
  context: RouteContext
): Promise<Metadata> => {
  const { slug } = await context.params;
  const post = await loadPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      tags: [...post.tags],
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'limjaejoon blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
};

export default async function BlogPostPage(context: RouteContext) {
  const { slug } = await context.params;
  const post = await loadPost(slug);

  if (!post) {
    notFound();
  }

  const { previous, next } = pickAdjacentPosts(
    await loadPublishedPosts(),
    post
  );
  const headings = extractHeadings(post.content_markdown);
  const publishedAt = formatPublishedAt(post.published_at);

  return (
    <main className='grow pt-blog-section-sm pb-blog-section'>
      <div className='mx-auto max-w-blog-wide px-blog-gutter'>
        <article>
          <PostJsonLd post={post} />

          <header className={COLUMN}>
            <h1 className='text-3xl font-semibold break-keep sm:text-4xl'>
              {post.title}
            </h1>

            <p className='mt-4 text-base break-keep text-blog-muted-foreground sm:text-lg'>
              {post.description}
            </p>

            <div className='mt-6 flex flex-wrap items-center gap-3 text-sm text-blog-muted-foreground'>
              {publishedAt ? (
                <time dateTime={post.published_at ?? undefined}>
                  {publishedAt}
                </time>
              ) : null}

              {post.tags.map((tag) => {
                return (
                  <Badge
                    key={tag}
                    variant='secondary'>
                    #{tag}
                  </Badge>
                );
              })}
            </div>

            <PostAdminActions id={post.id} />
          </header>

          <div className='gap-x-grid-gap mt-12 grid lg:grid-cols-[minmax(0,54rem)_15rem] lg:justify-between'>
            <PostToc
              headings={headings}
              className='mb-8 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:self-start'
            />

            <div className='min-w-0 lg:col-start-1 lg:row-start-1'>
              <PostContent markdown={post.content_markdown} />
            </div>
          </div>
        </article>

        <div className={COLUMN}>
          <PostNav
            previous={previous}
            next={next}
          />
        </div>
      </div>
    </main>
  );
}
