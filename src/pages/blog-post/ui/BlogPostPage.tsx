/** Blog 상세 — 본문·목차·앞뒤 내비를 조립한다 */
import { notFound } from 'next/navigation';
import {
  extractHeadings,
  formatPublishedAt,
  pickAdjacentPosts,
} from '@/entities/post';
// 배럴을 거치지 않는다 — shiki 를 끌고 오는 모듈이라 배럴에 두면 클라이언트 번들이 오염된다
import { PostContent } from '@/entities/post/ui/PostContent';
import { TransitionLink } from '@/shared/transition';
import { Container } from '@/shared/ui';
import { SiteFooter } from '@/widgets/site-footer';
import { loadPost } from '../lib/loadPost';
import { loadPublishedPosts } from '../lib/loadPublishedPosts';
import { PostAdminActions } from './PostAdminActions/PostAdminActions';
import { PostNav } from './PostNav/PostNav';
import { PostToc } from './PostToc/PostToc';

/** slug 하나를 읽어 글 한 편을 그린다 */
export async function BlogPostPage({ slug }: { slug: string }) {
  const post = await loadPost(slug);

  // draft·없는 글은 여기서 끊는다 — 공개 조회가 published 만 보므로 둘이 같은 결과다
  if (!post) {
    notFound();
  }

  const posts = await loadPublishedPosts();
  const adjacent = pickAdjacentPosts(posts, post);
  const headings = extractHeadings(post.content_markdown);
  const publishedAt = formatPublishedAt(post.published_at);

  return (
    // 글 공간은 밝게 뒤집는다 — svh 를 채워야 뒤로 body 의 다크 배경이 비치지 않는다
    <div
      data-surface='light'
      className='flex min-h-svh flex-col bg-background'>
      <main className='grow bg-background py-section text-foreground'>
        <Container size='wide'>
          <header className='mx-auto max-w-content'>
            {post.series ? (
              <p className='text-label text-accent uppercase'>{post.series}</p>
            ) : null}
            <h1 className='mt-3 text-statement break-keep'>{post.title}</h1>
            <p className='mt-4 text-body-lg break-keep text-muted'>
              {post.description}
            </p>
            <div className='mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-subtle'>
              {publishedAt ? (
                <time dateTime={post.published_at ?? undefined}>
                  {publishedAt}
                </time>
              ) : null}
              {post.tags.length > 0 ? (
                <ul className='flex flex-wrap gap-2'>
                  {post.tags.map((tag) => {
                    return (
                      <li key={tag}>
                        <TransitionLink
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className='transition-colors duration-quick ease-standard hover:text-accent'>
                          #{tag}
                        </TransitionLink>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>

            <PostAdminActions id={post.id} />
          </header>

          {/* 목차가 grid 의 두 번째 칸으로 가고, 좁은 화면에서는 순서상 본문 위에 남는다 */}
          <div className='mx-auto mt-16 grid max-w-content gap-x-12 gap-y-8 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_15rem]'>
            <PostToc
              headings={headings}
              className='lg:order-2'
            />
            <div className='min-w-0 lg:order-1 lg:mx-auto lg:max-w-content'>
              <PostContent markdown={post.content_markdown} />
              <PostNav
                previous={adjacent.previous}
                next={adjacent.next}
                series={post.series}
              />
            </div>
          </div>
        </Container>
      </main>
      {/* main 밖이다 — main 안에 중첩된 footer 는 contentinfo 랜드마크가 되지 않는다 */}
      <SiteFooter />
    </div>
  );
}
