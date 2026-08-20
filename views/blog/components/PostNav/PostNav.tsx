import Link from 'next/link';
import type { AdjacentPosts } from '../../lib/pickAdjacentPosts';
import type { PostListItem } from '../../lib/post.types';
import { clsx } from 'clsx';

/** 앞뒤 글 카드 한 장. 다음 글은 오른쪽 끝에 붙어 방향이 드러난다. */
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
      className={clsx(
        'group flex h-full flex-col gap-2 rounded-lg border border-blog-border p-4 transition-colors duration-200 ease-in-out hover:border-blog-input',
        align === 'end' && 'sm:items-end sm:text-end'
      )}>
      <span className='text-xs tracking-widest text-blog-muted-foreground uppercase'>
        {label}
      </span>
      <span className='text-base break-keep transition-colors duration-200 ease-in-out group-hover:text-blog-primary'>
        {post.title}
      </span>
    </Link>
  );
}

/** 글 아래 앞뒤 글 내비. 양쪽 다 없으면 통째로 감춘다. */
export function PostNav({ previous, next }: AdjacentPosts) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label='앞뒤 글'
      className='mt-16 grid gap-4 border-t border-blog-border pt-8 sm:grid-cols-2'>
      {previous ? (
        <PostNavLink
          post={previous}
          label='이전 글'
        />
      ) : (
        // 이전 글이 없어도 빈 칸을 세워야 다음 글이 오른쪽 자리를 지킨다
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
