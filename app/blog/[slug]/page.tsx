import { Badge } from '@/components/ui/badge';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { PostAdminActions } from '@/views/blog/components/PostAdminActions/PostAdminActions';
import { PostContent } from '@/views/blog/components/PostContent';
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

/** 읽기 기둥 — 머리말·본문·앞뒤 글이 같은 왼쪽 폭에 서고, 목차만 오른쪽 끝으로 빠진다 */
const COLUMN = 'max-w-[54rem]';

// generateMetadata 와 페이지 렌더가 같은 글을 두 번 조회하지 않게 감싼다 — 같은 모듈이라 캐시를 공유한다
const loadPost = cache(async (slug: string) => {
  return getPostBySlug(createSupabaseStaticClient(), slug);
});

// 앞뒤 글 계산용 목록 조회 — 본문과 같은 렌더 안에서 한 번만 부른다
const loadPublishedPosts = cache(async () => {
  return getPosts(createSupabaseStaticClient());
});

/** 발행된 글 경로를 빌드 시점에 미리 만든다 (그 뒤 발행분은 첫 요청에 생성된다) */
export const generateStaticParams = async () => {
  const slugs = await getPostSlugs(createSupabaseStaticClient());

  return slugs.map((slug) => {
    return { slug };
  });
};

/** 글마다 제목·설명·공유 카드를 붙인다 (없는 글이면 레이아웃 기본값이 남는다) */
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
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      tags: [...post.tags],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.description,
    },
  };
};

/** Blog 상세 — 조회·조판은 서버에서 끝내고, 클라이언트로 넘어가는 건 목차의 현재 위치뿐이다 */
export default async function BlogPostPage(context: RouteContext) {
  const { slug } = await context.params;
  const post = await loadPost(slug);

  // 공개 조회가 published 만 보므로 draft 도 여기서 끊긴다
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
    // 밝은 바탕과 svh 는 app/blog/layout.tsx 가 소유한다
    // 위아래가 다르다 — 위는 nav 가 이미 자리를 먹어 절반이면 되고, 아래는 글이 끝났다는 여백이 그대로 필요하다
    <main className='grow pt-section-sm pb-section'>
      {/* wide 다 — 읽기 폭은 그대로 두고 목차만 화면 오른쪽으로 더 밀어내려면 바깥 그릇이 넓어야 한다 */}
      <div className='mx-auto max-w-wide px-gutter'>
        <article>
          <header className={COLUMN}>
            <h1 className='text-3xl font-semibold break-keep sm:text-4xl'>
              {post.title}
            </h1>

            <p className='mt-4 text-body break-keep text-muted-foreground sm:text-body-lg'>
              {post.description}
            </p>

            <div className='mt-6 flex flex-wrap items-center gap-3 text-body-sm text-muted-foreground'>
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

          {/* 목차가 DOM 에서 앞이라 좁은 화면에서는 본문 위에 접혀 나오고, lg 부터 오른쪽 칸으로 간다 */}
          <div className='mt-12 grid gap-x-grid-gap lg:grid-cols-[minmax(0,54rem)_15rem] lg:justify-between'>
            <PostToc
              headings={headings}
              className='mb-8 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:self-start'
            />

            {/* min-w-0 이 없으면 긴 코드 블록이 격자 칸을 밀어 넓혀 목차를 화면 밖으로 보낸다 */}
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
