'use client';

import { clsx } from 'clsx';
import { Tooltip } from 'radix-ui';
import { useRef, useState } from 'react';
import type { PostListItem } from '@/domains/posts/types/post.types';

/** 한 줄로 자른 글 링크. 잘린 줄에 올리면 그 자리에서 전체 제목이 펼쳐진다. */
export function PostLink({
  post,
  current,
}: {
  post: PostListItem;
  current: boolean;
}) {
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  return (
    <Tooltip.Root
      open={open}
      onOpenChange={(next) => {
        const link = linkRef.current;
        // truncate는 CSS라 React가 잘림을 모른다. 열 때마다 한 번 재서 안 잘린 줄은 띄우지 않는다
        setOpen(next && link !== null && link.scrollWidth > link.clientWidth);
      }}>
      {/* 링크 글자가 이미 전체 제목이라, describedby까지 걸면 스크린리더가 제목을 두 번 읽는다 */}
      <Tooltip.Trigger
        asChild
        aria-describedby={undefined}>
        {/* Link가 아니라 a다. /blog 안의 소프트 이동은 @peek가 가로채 피크로 열어 버린다 */}
        <a
          ref={linkRef}
          href={`/blog/${post.slug}`}
          aria-current={current ? 'page' : undefined}
          className={clsx(
            'block truncate transition-colors duration-200 ease-in-out',
            current
              ? 'text-blog-primary'
              : 'text-blog-muted-foreground hover:text-blog-foreground'
          )}>
          {post.title}
        </a>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        {/* 줄 아래에 붙인 뒤 -22px 끌어올려 줄 위에 겹친다. 줄 높이 20px + 판 위 여백 2px라, 바꾸면 펼친 제목이 줄에서 위아래로 어긋난다 */}
        {/* alignOffset -8은 px-2만큼 왼쪽으로 빼 글자 시작을 원래 줄과 맞춘다. avoidCollisions를 켜면 화면 끝에서 판이 줄을 떠나 뒤집힌다 */}
        {/* 가용 폭은 줄 왼쪽부터 화면 오른쪽 끝까지다. 그보다 긴 제목만 줄바꿈되고, 짧은 제목은 한 줄로 펼쳐진다 */}
        <Tooltip.Content
          side='bottom'
          align='start'
          sideOffset={-22}
          alignOffset={-8}
          avoidCollisions={false}
          data-library-tip
          className='z-(--z-overlay) max-w-(--radix-tooltip-content-available-width) rounded-md bg-blog-background px-2 py-0.5 text-sm break-keep text-blog-foreground shadow-md ring-1 ring-blog-border'>
          {post.title}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
