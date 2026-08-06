/** 앞뒤 글 내비 — 시리즈 글은 같은 연재 안에서, 단발 글은 전체에서 잇는다 */
import type { AdjacentPosts, PostListItem } from '@/entities/post';
import { cn } from '@/shared/lib';
import { TransitionLink } from '@/shared/transition';

const DIRECTION_LABEL = {
  previous: '이전 글',
  next: '다음 글',
} as const;

function PostNavLink({
  post,
  direction,
  className,
}: {
  post: PostListItem;
  direction: keyof typeof DIRECTION_LABEL;
  className?: string;
}) {
  return (
    <TransitionLink
      href={`/blog/${post.slug}`}
      className={cn(
        'group flex flex-col gap-2 rounded-md border border-border p-5 transition-colors duration-quick ease-standard hover:border-border-strong',
        className
      )}>
      <span className='text-label text-subtle uppercase'>
        {DIRECTION_LABEL[direction]}
      </span>
      <span className='text-body-lg break-keep text-foreground group-hover:text-accent'>
        {post.title}
      </span>
    </TransitionLink>
  );
}

/** 앞뒤 글이 하나도 없으면 아무것도 그리지 않는다 */
export function PostNav({
  previous,
  next,
  series,
}: AdjacentPosts & { series: string | null }) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label={series ? `${series} 연재 이동` : '글 이동'}
      className='mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2'>
      {previous ? (
        <PostNavLink
          post={previous}
          direction='previous'
        />
      ) : null}
      {/* previous 가 없어도 다음 글은 오른쪽 칸을 지킨다 */}
      {next ? (
        <PostNavLink
          post={next}
          direction='next'
          className='sm:col-start-2 sm:items-end sm:text-end'
        />
      ) : null}
    </nav>
  );
}
