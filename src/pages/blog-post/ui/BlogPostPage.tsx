/** Blog 상세 — 조회·조판은 서버에서 끝내고, 클라이언트로 넘어가는 건 목차의 현재 위치뿐이다 */
import { notFound } from 'next/navigation';
import {
  extractHeadings,
  formatPublishedAt,
  pickAdjacentPosts,
} from '@/entities/post';
import { PostContent } from '@/entities/post/ui/PostContent';
import { Badge } from '@/shared/ui';
import { loadPost } from '../lib/loadPost';
import { loadPublishedPosts } from '../lib/loadPublishedPosts';
import { PostAdminActions } from './PostAdminActions/PostAdminActions';
import { PostNav } from './PostNav/PostNav';
import { PostToc } from './PostToc/PostToc';

/** 읽기 기둥 — 머리말·본문·앞뒤 글이 같은 왼쪽 폭에 서고, 목차만 오른쪽 끝으로 빠진다 */
const COLUMN = 'max-w-[54rem]';

export async function BlogPostPage({ slug }: { slug: string }) {
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
