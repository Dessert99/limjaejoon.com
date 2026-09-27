import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { PostAdminActions } from '@/views/blog/components/PostAdminActions/PostAdminActions';
import { PostContent } from '@/views/blog/components/PostContent';
import { PostComments } from '@/views/blog/components/PostComments';
import { PostJsonLd } from '@/views/blog/components/PostJsonLd';
import { PostToc } from '@/views/blog/components/PostToc/PostToc';
import { StoryNav } from '@/views/blog/components/StoryNav/StoryNav';
import { extractHeadings } from '@/views/blog/lib/extractHeadings';
import { formatPublishedAt } from '@/views/blog/lib/formatPublishedAt';
import {
  getPostBySlug,
  getPostSlugs,
  getPosts,
} from '@/views/blog/server/posts';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

// generateMetadata와 페이지가 같은 글을 두 번 안 읽도록 요청 단위로 캐시한다
const loadPost = cache(async (slug: string) => {
  return getPostBySlug(createSupabaseStaticClient(), slug);
});

/** 발행된 이야기 주소를 미리 뽑아 회고 상세를 빌드 때 정적으로 만든다. */
export const generateStaticParams = async () => {
  const slugs = await getPostSlugs(createSupabaseStaticClient(), 'story');

  return slugs.map((slug) => {
    return { slug };
  });
};

/** 회고 한 편의 제목·설명·OG 태그. 없는 글이면 빈 메타로 두고 페이지가 404를 낸다. */
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
    alternates: { canonical: `/experience/${post.slug}` },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      title: post.title,
      description: post.description,
      url: `/experience/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
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

/** 회고 상세. 본문은 개념 글과 같은 부품을 쓰고, 왼쪽 내비만 이야기 목록으로 바꾼다. */
export default async function ExperiencePostPage(context: RouteContext) {
  const { slug } = await context.params;
  const post = await loadPost(slug);

  if (!post) {
    notFound();
  }

  // 개념 글은 방 안의 글이다. 주소를 잘못 이어 붙여 들어와도 제자리로 보낸다
  if (post.kind !== 'story') {
    permanentRedirect(`/blog/${post.slug}`);
  }

  // 칩이 개념 글 제목을 찾아야 하므로 전체를 받고, 내비에는 이야기만 넘긴다
  const posts = await getPosts(createSupabaseStaticClient());
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

            {publishedAt ? (
              <time
                dateTime={post.published_at ?? undefined}
                className='mt-6 block text-sm text-blog-muted-foreground'>
                {publishedAt}
              </time>
            ) : null}

            <PostAdminActions id={post.id} />
          </header>

          {/* 글 상세와 같은 3단. 좌우 1fr을 같은 폭으로 비워야 본문이 화면 정중앙에 온다 */}
          <div className='mt-12 grid gap-x-blog-grid-gap xl:grid-cols-[minmax(0,1fr)_minmax(0,48rem)_minmax(0,1fr)]'>
            <PostToc
              headings={headings}
              className='hidden xl:sticky xl:top-24 xl:col-start-3 xl:row-start-1 xl:block xl:self-start'
            />

            <StoryNav
              posts={posts.filter((item) => {
                return item.kind === 'story';
              })}
              currentSlug={post.slug}
              className='hidden xl:sticky xl:top-24 xl:col-start-1 xl:row-start-1 xl:block xl:max-h-[calc(100svh-12rem)] xl:self-start xl:overflow-y-auto'
            />

            {/* w-full이 빠지면 mx-auto가 stretch를 꺼 본문이 쪼그라들고, min-w-0이 빠지면 긴 코드 블록이 폭을 밀어낸다 */}
            <div className='mx-auto w-full max-w-[48rem] min-w-0 xl:col-start-2 xl:row-start-1'>
              <PostContent
                markdown={post.content_markdown}
                posts={posts}
              />
            </div>
          </div>
        </article>

        <div className='mx-auto max-w-[48rem]'>
          <div className='mt-16 border-t border-blog-border pt-8'>
            <PostComments postId={post.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
