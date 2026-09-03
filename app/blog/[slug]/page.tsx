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

// generateMetadata와 페이지가 같은 글을 두 번 안 읽도록 요청 단위로 캐시한다
const loadPost = cache(async (slug: string) => {
  return getPostBySlug(createSupabaseStaticClient(), slug);
});

const loadPublishedPosts = cache(async () => {
  return getPosts(createSupabaseStaticClient());
});

/** 발행된 글 주소를 미리 뽑아 상세 페이지를 빌드 때 정적으로 만든다. */
export const generateStaticParams = async () => {
  const slugs = await getPostSlugs(createSupabaseStaticClient());

  return slugs.map((slug) => {
    return { slug };
  });
};

/** 글 한 편의 제목·설명·OG 태그. 없는 글이면 빈 메타로 두고 페이지가 404를 낸다. */
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

/** 글 상세 페이지. 본문 왼쪽·목차 오른쪽 2단이고 좁은 화면에서는 목차가 위로 접힌다. */
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

          <header className='mx-auto max-w-[48rem]'>
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

          {/* 본문 48rem. 키우면 한 줄이 길어져 읽는 눈이 돌아오기 힘들어진다 */}
          {/* 좌우 1fr을 같은 폭으로 비워야 본문이 화면 정중앙에 온다. 그냥 1fr이면 목차 글자가 대칭을 깬다 */}
          <div className='mt-12 grid gap-x-blog-grid-gap xl:grid-cols-[minmax(0,1fr)_minmax(0,48rem)_minmax(0,1fr)]'>
            {/* 마크업은 목차가 먼저라 좁은 화면에서 위로 오고, 넓어지면 col-start로 오른쪽에 붙는다 */}
            <PostToc
              headings={headings}
              className='mb-8 xl:sticky xl:top-24 xl:col-start-3 xl:row-start-1 xl:mb-0 xl:self-start'
            />

            {/* w-full이 빠지면 mx-auto가 stretch를 꺼 본문이 쪼그라들고, min-w-0이 빠지면 긴 코드 블록이 폭을 밀어낸다 */}
            <div className='mx-auto w-full max-w-[48rem] min-w-0 xl:col-start-2 xl:row-start-1'>
              <PostContent markdown={post.content_markdown} />
            </div>
          </div>
        </article>

        <div className='mx-auto max-w-[48rem]'>
          <PostNav
            previous={previous}
            next={next}
          />
        </div>
      </div>
    </main>
  );
}
