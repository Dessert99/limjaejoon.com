import Link from 'next/link';
import { formatPublishedAt } from '../../lib/formatPublishedAt';
import { type PostListItem } from '../../lib/post.types';
import { Badge } from '@/views/blog/components/ui/badge';

const CHIP_CLASS = 'cursor-pointer';

type PostRowProps = {
  post: PostListItem;
  onSelectTag: (tag: string) => void;
};

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
      </div>
    </article>
  );
}
