/** 목록 한 건 — 제목·설명으로 글을 열고, 시리즈·태그로 목록을 좁힌다 */
import Link from 'next/link';
import { formatPublishedAt, type PostListItem } from '@/entities/post';
import { Badge } from '@/shared/ui';

// 칩은 링크가 아니라 버튼이다 — 같은 라우트로 이동하면 필터 상태가 갱신되지 않는다
const CHIP_CLASS = 'cursor-pointer';

type PostRowProps = {
  post: PostListItem;
  onSelectSeries: (series: string) => void;
  onSelectTag: (tag: string) => void;
};

/** 구분선으로 갈린 목록의 한 줄 — 구분선 자체는 목록이 그린다 */
export function PostRow({ post, onSelectSeries, onSelectTag }: PostRowProps) {
  const publishedAt = formatPublishedAt(post.published_at);

  return (
    <article className='py-8'>
      {/* TransitionLink 가 아니다 — 커튼은 라우트 첫 세그먼트가 같으면 치지 않아 목록→글 이동에선 하는 일이 없다 */}
      <Link
        href={`/blog/${post.slug}`}
        className='group block'>
        <h3 className='text-body-xl break-keep transition-colors duration-quick ease-standard group-hover:text-primary'>
          {post.title}
        </h3>
        <p className='mt-2 text-body break-keep text-muted-foreground'>
          {post.description}
        </p>
      </Link>

      <div className='mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-body-sm text-muted-foreground'>
        {publishedAt ? (
          <time dateTime={post.published_at ?? undefined}>{publishedAt}</time>
        ) : null}

        {post.series ? (
          <Badge
            asChild
            variant='outline'>
            <button
              type='button'
              className={CHIP_CLASS}
              onClick={() => {
                onSelectSeries(post.series ?? '');
              }}>
              {post.series}
            </button>
          </Badge>
        ) : null}

        {post.tags.map((tag) => {
          return (
            <Badge
              key={tag}
              asChild
              variant='secondary'>
              <button
                type='button'
                className={CHIP_CLASS}
                onClick={() => {
                  onSelectTag(tag);
                }}>
                #{tag}
              </button>
            </Badge>
          );
        })}
      </div>
    </article>
  );
}
