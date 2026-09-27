import { clsx } from 'clsx';
import Link from 'next/link';
import type { PostListItem } from '@/views/blog/lib/post.types';

/** 회고 상세 왼쪽의 이야기 목록. 개념 글은 섞지 않고 본문 칩의 피크로만 들여다본다. */
export function StoryNav({
  posts,
  currentSlug,
  className,
}: {
  posts: PostListItem[];
  currentSlug: string;
  className?: string;
}) {
  return (
    <nav
      aria-label='이야기'
      className={className}>
      <Link
        href='/experience'
        className='text-xs tracking-widest text-blog-muted-foreground transition-colors duration-200 ease-in-out hover:text-blog-foreground'>
        ← 창밖
      </Link>

      <ol className='mt-6 space-y-2 text-sm'>
        {posts.map((post) => {
          const current = post.slug === currentSlug;

          return (
            <li key={post.slug}>
              <Link
                href={`/experience/${post.slug}`}
                aria-current={current ? 'page' : undefined}
                className={clsx(
                  'block break-keep transition-colors duration-200 ease-in-out',
                  current
                    ? 'text-blog-primary'
                    : 'text-blog-muted-foreground hover:text-blog-foreground'
                )}>
                {post.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
