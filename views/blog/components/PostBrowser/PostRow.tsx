import Link from 'next/link';
import { formatPublishedAt } from '../../lib/formatPublishedAt';
import { type PostListItem } from '../../lib/post.types';
import { Badge } from '@/views/blog/components/ui/badge';

type PostRowProps = {
  post: PostListItem;
  onSelectTag: (tag: string) => void;
};

/** 목록의 글 한 줄. 태그를 누르면 그 태그로 목록이 좁혀진다. */
export function PostRow({ post, onSelectTag }: PostRowProps) {
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

      <div className='mt-4 flex flex-col gap-2 text-sm text-blog-muted-foreground'>
        {publishedAt ? (
          <time dateTime={post.published_at ?? undefined}>{publishedAt}</time>
        ) : null}

        <div className='flex flex-wrap gap-2'>
          {post.tags.map((tag) => {
            return (
              <Badge
                key={tag}
                asChild
                variant='secondary'>
                <button
                  type='button'
                  className='cursor-pointer'
                  onClick={() => {
                    onSelectTag(tag);
                  }}>
                  #{tag}
                </button>
              </Badge>
            );
          })}
        </div>
      </div>
    </article>
  );
}
