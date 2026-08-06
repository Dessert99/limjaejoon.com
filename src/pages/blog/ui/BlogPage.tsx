/** Blog — 발행 글 목록. 정적으로 전부 굳히고 거르는 일은 브라우저가 한다 */
import { getPosts } from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';
import { Container } from '@/shared/ui';
import { SiteFooter } from '@/widgets/site-footer';
import { BlogAdminActions } from './BlogAdminActions/BlogAdminActions';
import { PostBrowser, type SeriesSummary } from './PostBrowser/PostBrowser';

/** 필터 선택지는 목록을 한 번만 훑어 뽑는다 */
function summarize(posts: Awaited<ReturnType<typeof getPosts>>) {
  const tags = new Set<string>();
  const seriesCount = new Map<string, number>();

  for (const post of posts) {
    post.tags.forEach((tag) => {
      tags.add(tag);
    });

    if (post.series) {
      seriesCount.set(post.series, (seriesCount.get(post.series) ?? 0) + 1);
    }
  }

  const seriesList: SeriesSummary[] = [...seriesCount].map(([name, count]) => {
    return { name, count };
  });

  return { tags: [...tags].sort(), seriesList };
}

export async function BlogPage() {
  const posts = await getPosts(createSupabaseStaticClient());
  const { tags, seriesList } = summarize(posts);

  return (
    // 글 공간은 밝게 뒤집는다 — svh 를 채워야 뒤로 body 의 다크 배경이 비치지 않는다
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background'>
      <main className='grow bg-background py-section text-foreground'>
        <Container>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <h1 className='text-statement'>블로그</h1>
            <BlogAdminActions />
          </div>
          <p className='mt-4 text-body-lg break-keep text-muted'>
            읽고 만들며 배운 것을 정리해 둔다.
          </p>

          <div className='mt-12'>
            <PostBrowser
              posts={posts}
              tags={tags}
              seriesList={seriesList}
            />
          </div>
        </Container>
      </main>
      {/* main 밖이다 — main 안에 중첩된 footer 는 contentinfo 랜드마크가 되지 않는다 */}
      <SiteFooter />
    </div>
  );
}
