/** 무한 마퀴 — 트랙의 translate 만 소유한다. 스크롤과 무관한 루프라 CSS keyframes 로 돈다 */
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/shared/lib';

/** paused 는 작성자용 스위치다 — 사용자 쪽 정지는 prefers-reduced-motion 가드가 담당한다 */
type MarqueeProps = ComponentPropsWithRef<'div'> & {
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  paused?: boolean;
};

// 각 벌의 뒤쪽 여백까지 폭에 포함돼야 -50% 이동이 정확히 한 벌만큼이 된다
const COPY_CLASS = 'flex shrink-0 items-center gap-grid-gap pe-grid-gap';

/** 끊김 없이 흐르는 가로 띠 — 원문 한 벌과 감춘 복제 한 벌로 이음매를 지운다 */
export function Marquee({
  direction = 'left',
  speed = 'normal',
  paused = false,
  className,
  children,
  ...rest
}: MarqueeProps) {
  return (
    <div
      className={cn('overflow-hidden', className)}
      {...rest}>
      <div
        className='flex w-max marquee-track'
        data-marquee-direction={direction}
        data-marquee-speed={speed}
        data-marquee-paused={String(paused)}>
        <div className={COPY_CLASS}>{children}</div>
        {/* 복제본은 이음매를 메우는 장식일 뿐이라 읽히면 문구가 두 번 나온다 */}
        {/* inert 를 함께 건다 — aria-hidden 은 접근성 트리만 가려서 복제된 링크가 탭 순서에 그대로 남는다 */}
        <div
          aria-hidden='true'
          inert
          className={COPY_CLASS}>
          {children}
        </div>
      </div>
    </div>
  );
}
