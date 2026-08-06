/** 목록 한 건 — 제목·설명으로 글을 열고, 태그로 목록을 좁힌다 */
import { formatPublishedAt, type PostListItem } from '@/entities/post';
import { TransitionLink } from '@/shared/transition';

/** 태그는 링크가 아니라 버튼이다 — 같은 라우트로 이동하면 필터 상태가 갱신되지 않는다 */
export function PostCard({
  post,
  onSelectTag,
}: {
  post: PostListItem;
  onSelectTag: (tag: string) => void;
}) {
  const publishedAt = formatPublishedAt(post.published_at);

  return (
    <article className='border-t border-border py-8'>
      <TransitionLink
        href={`/blog/${post.slug}`}
        className='group block'>
        {post.series ? (
          <p className='text-label text-accent uppercase'>{post.series}</p>
        ) : null}
        <h3 className='mt-2 text-body-xl break-keep transition-colors duration-quick ease-standard group-hover:text-accent'>
          {post.title}
        </h3>
        <p className='mt-2 text-body break-keep text-muted'>
          {post.description}
        </p>
      </TransitionLink>

      <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm text-subtle'>
        {publishedAt ? (
          <time dateTime={post.published_at ?? undefined}>{publishedAt}</time>
        ) : null}
        {post.tags.length > 0 ? (
          <ul className='flex flex-wrap gap-2'>
            {post.tags.map((tag) => {
              return (
                <li key={tag}>
                  <button
                    type='button'
                    onClick={() => {
                      onSelectTag(tag);
                    }}
                    className='transition-colors duration-quick ease-standard hover:text-accent'>
                    #{tag}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
