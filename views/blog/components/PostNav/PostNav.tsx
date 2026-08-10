/** 앞뒤 글 — 연재 글은 같은 시리즈 안에서 이어진다(규칙은 pickAdjacentPosts 가 소유한다) */
import Link from 'next/link';
import type { AdjacentPosts } from '../../lib/pickAdjacentPosts';
import type { PostListItem } from '../../lib/post.types';
import { cn } from '@/lib/utils';

function PostNavLink({
  post,
  label,
  align,
}: {
  post: PostListItem;
  label: string;
  align?: 'end';
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group flex h-full flex-col gap-2 rounded-md border border-border p-4 transition-colors duration-quick ease-standard hover:border-input',
        // 다음 글은 오른쪽 칸이라 글자도 오른쪽에 붙어야 방향이 읽힌다
        align === 'end' && 'sm:items-end sm:text-end'
      )}>
      <span className='text-label text-muted-foreground uppercase'>
        {label}
      </span>
      <span className='text-body break-keep transition-colors duration-quick ease-standard group-hover:text-primary'>
        {post.title}
      </span>
    </Link>
  );
}

/** 앞뒤 글이 하나도 없으면 아무것도 그리지 않는다 */
export function PostNav({ previous, next }: AdjacentPosts) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label='앞뒤 글'
      className='mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2'>
      {previous ? (
        <PostNavLink
          post={previous}
          label='이전 글'
        />
      ) : (
        // 빈 칸을 세워 다음 글이 왼쪽으로 당겨지지 않게 한다 — 자리가 방향을 말해 준다
        <div className='hidden sm:block' />
      )}

      {next ? (
        <PostNavLink
          post={next}
          label='다음 글'
          align='end'
        />
      ) : null}
    </nav>
  );
}
