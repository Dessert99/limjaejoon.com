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
