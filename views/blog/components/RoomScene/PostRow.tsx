import Link from 'next/link';
import { formatPublishedAt } from '../../lib/formatPublishedAt';
import { type PostListItem } from '../../lib/post.types';

/** 책 목록의 글 한 줄. 누르면 그 글로 간다. */
export function PostRow({ post }: { post: PostListItem }) {
  const publishedAt = formatPublishedAt(post.published_at);

  return (
    <article className='py-8'>
      <Link
        href={`/blog/${post.slug}`}
        className='group block'>
        <h3 className='line-clamp-2 text-lg wrap-anywhere break-keep transition-colors duration-200 ease-in-out group-hover:text-blog-primary sm:text-xl'>
          {post.title}
        </h3>
        {/* 설명이 한 줄이어도 2줄 자리를 잡아 줄마다 카드 높이가 들쭉날쭉해지지 않는다 */}
        <p className='mt-2 line-clamp-2 min-h-[2lh] text-base wrap-anywhere break-keep text-blog-muted-foreground'>
          {post.description}
        </p>
      </Link>

      {publishedAt ? (
        <div className='mt-4 text-sm text-blog-muted-foreground'>
          <time dateTime={post.published_at ?? undefined}>{publishedAt}</time>
        </div>
      ) : null}
    </article>
  );
}
