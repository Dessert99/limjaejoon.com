'use client';

import Link from 'next/link';
import { type PointerEvent } from 'react';
import { formatPublishedAt } from '../../lib/formatPublishedAt';
import { type PostListItem } from '../../lib/post.types';

// 책 색 원의 중심. 들어온 자리에서 퍼지고 나간 자리로 오그라든다. 안에서 움직일 때는 안 적어, 덮인 뒤 보이지 않는 이동에 스타일 계산이 돌지 않게 한다
const trackPointer = (event: PointerEvent<HTMLAnchorElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();

  event.currentTarget.style.setProperty(
    '--x',
    `${event.clientX - rect.left}px`
  );
  event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`);
};

/** 책 모달의 글 카드. 흰 반투명 면이라 어떤 책 색 위에서도 같은 카드로 읽히고, 올리면 책 색이 스며들며 누르면 그 글로 간다. */
export function PostCard({ post }: { post: PostListItem }) {
  const publishedAt = formatPublishedAt(post.published_at);

  return (
    // 흰 60%는 책 색이 옅게 비치는 선. 올리면 책마다 같은 흰 카드가 되고, 내리면 검은 글자가 바탕 색에 묻힌다
    // 테두리 2px는 카드와 책 색 바탕의 경계선. 굵히면 카드가 틀처럼 도드라지고, 얇히면 흰 면이 바탕에 스민다
    // 뒤 흐림(blur-md 12px)은 워터마크가 글자 뒤로 비쳐 지저분해지지 않게 한다. 줄이면 로고 윤곽이 카드 안에 드러난다
    // 글자색 전환 300ms는 번지는 원(650ms)보다 짧아, 원이 글자에 닿기 전에 크림색으로 바뀌어 검은 글자가 책 색 위에 남지 않는다
    <Link
      href={`/blog/${post.slug}`}
      onPointerEnter={trackPointer}
      onPointerLeave={trackPointer}
      className='group relative block h-full overflow-hidden rounded-xl border-2 border-blog-background/30 bg-blog-background/60 px-6 py-5 text-blog-foreground backdrop-blur-md transition-colors duration-300 hover:text-[#f5f1e8] focus-visible:text-[#f5f1e8] focus-visible:ring-2 focus-visible:ring-blog-ring focus-visible:outline-none'>
      {/* 책 색 원. 650ms를 늘리면 잉크가 천천히 번지고, 줄이면 한 번에 칠해진다. 끝 반지름 150%는 어느 모서리에서 들어와도 카드를 다 덮는 크기다 */}
      {/* ease는 빠르게 퍼졌다 끝에서 멈칫하는 곡선이라, linear로 바꾸면 기계적으로 커진다. 검정 15%를 섞어 크림 글자와 대비를 한 단계 올린다 */}
      <span
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[color-mix(in_srgb,var(--book)_85%,black)] transition-[clip-path] duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:circle(0_at_var(--x,50%)_var(--y,50%))] group-hover:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))] group-focus-visible:[clip-path:circle(150%_at_var(--x,50%)_var(--y,50%))]'
      />
      <h3 className='relative line-clamp-2 text-lg leading-snug font-semibold break-keep'>
        {post.title}
      </h3>
      <p className='relative mt-2 line-clamp-2 text-[15px] leading-relaxed break-keep text-blog-muted-foreground transition-colors duration-300 group-hover:text-[#f5f1e8]/80 group-focus-visible:text-[#f5f1e8]/80'>
        {post.description}
      </p>
      {publishedAt ? (
        <time
          dateTime={post.published_at ?? undefined}
          className='relative mt-3 block text-[13px] text-blog-muted-foreground transition-colors duration-300 group-hover:text-[#f5f1e8]/80 group-focus-visible:text-[#f5f1e8]/80'>
          {publishedAt}
        </time>
      ) : null}
    </Link>
  );
}
