'use client';

/** 미디어 등장 — 바깥이 clip-path, 안쪽이 scale 을 소유한다(Media 는 aspect-ratio·object-fit) */
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { cn, staggerIndex, useInView } from '@/shared/lib';

/** ref 는 열지 않는다 — 루트 ref 는 관찰자 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
type MediaRevealProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ReactNode;
  once?: boolean;
  staggerIndex?: number;
};

/** 덮개가 열리는 동안 안쪽 미디어가 제자리로 조여드는 등장 — Hero·Work·Gallery 가 공유한다 */
export function MediaReveal({
  children,
  once = true,
  staggerIndex: index = 0,
  className,
  style,
  ...rest
}: MediaRevealProps) {
  const [ref, state] = useInView<HTMLDivElement>({ once });
  // 두 층이 같은 배수를 봐야 마스크와 스케일이 어긋나지 않는다
  const stagger = { '--stagger': staggerIndex(index) } as CSSProperties;

  return (
    <div
      ref={ref}
      // idle 에 해당하는 CSS 규칙은 없다 — 서버 렌더와 미지원 환경이 이 상태에 머문다
      data-media-reveal={state}
      className={cn(className)}
      {...rest}
      // 소비자 style 위에 덮는다 — 통째로 밀리면 마스크만 배수를 잃어 안쪽 스케일과 어긋난다
      style={{ ...style, ...stagger }}>
      <div
        data-media-scale={state}
        style={stagger}>
        {children}
      </div>
    </div>
  );
}
