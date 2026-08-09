/** 목록 한 건 — 제목·설명으로 글을 열고, 시리즈·태그로 목록을 좁힌다 */
import Link from 'next/link';
import { formatPublishedAt, type PostListItem } from '@/entities/post';
import { Badge } from '@/shared/ui';

// 칩은 링크가 아니라 버튼이다 — 같은 라우트로 이동하면 필터 상태가 갱신되지 않는다
const CHIP_CLASS = 'cursor-pointer';

type PostRowProps = {
  post: PostListItem;
  onSelectTag: (tag: string) => void;
};

/** 구분선으로 갈린 목록의 한 줄 — 구분선 자체는 목록이 그린다 */
export function PostRow({ post, onSelectTag }: PostRowProps) {
  const publishedAt = formatPublishedAt(post.published_at);

  return (
    <article className='py-8'>
      {/* TransitionLink 가 아니다 — 커튼은 라우트 첫 세그먼트가 같으면 치지 않아 목록→글 이동에선 하는 일이 없다 */}
      <Link
        href={`/blog/${post.slug}`}
        className='group block'>
        {/* break-words 가 아니라 wrap-anywhere 다 — break-word 로 생긴 줄바꿈 기회는 min-content 계산에 안 잡혀 격자 칸이 넓어지는 걸 못 막는다 */}
        {/* 제목엔 min-h 를 안 건다 — 한 줄짜리 대다수가 빈 줄을 이고 있는 대가가 두 줄 제목 몇 편을 맞추는 값어치보다 크다 */}
        <h3 className='line-clamp-2 text-body-lg wrap-anywhere break-keep transition-colors duration-quick ease-standard group-hover:text-primary sm:text-body-xl'>
          {post.title}
        </h3>
        {/* 설명은 지금 전부 두 줄이라 2lh 가 눈에 안 띈다 — 짧은 설명이 들어와도 카드 높이가 안 흔들리게 남겨 둔다 */}
        <p className='mt-2 line-clamp-2 min-h-[2lh] text-body wrap-anywhere break-keep text-muted-foreground'>
          {post.description}
        </p>
      </Link>

      {/* 날짜와 태그는 각자 한 줄을 갖는다 — 같은 줄에 두면 태그가 많은 글에서 날짜가 칩 사이로 밀려 안 읽힌다 */}
      <div className='mt-4 flex flex-col gap-2 text-body-sm text-muted-foreground'>
        {publishedAt ? (
          <time dateTime={post.published_at ?? undefined}>{publishedAt}</time>
        ) : null}

        {/* 태그는 몇 개든 다 보인다 — 감싸져 카드가 길어지는 쪽이 필터 후보를 감추는 것보다 낫다 */}
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
