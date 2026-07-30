'use client';

/** 마스크 등장 — 바깥이 overflow, 안쪽이 translate 를 소유한다(한 엘리먼트가 둘 다 잡지 않는다) */
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { cn, staggerIndex, useInView } from '@/shared/lib';

/** ref 는 열지 않는다 — 루트 ref 는 관찰자 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
/* staggerIndex 는 지연 "값"이 아니라 배수다 — 실제 지연은 stagger-delay 유틸리티가 계산한다 */
type MaskRevealProps = ComponentPropsWithoutRef<'div'> & {
  staggerIndex?: number;
  once?: boolean;
};

/** 블록 콘텐츠가 아래에서 밀려 올라오는 등장 — 글자 크기 클래스는 자식이 아니라 이 컴포넌트에 건다(오버행이 em 기준) */
export function MaskReveal({
  staggerIndex: index = 0,
  once = true,
  className,
  children,
  ...rest
}: MaskRevealProps) {
  const [ref, state] = useInView<HTMLDivElement>({ once });

  return (
    <div
      ref={ref}
      className={cn('mask-track', className)}
      {...rest}>
      <div
        // idle 에 해당하는 CSS 규칙은 없다 — 서버 렌더와 미지원 환경이 이 상태에 머물러 콘텐츠가 남는다
        data-reveal={state}
        style={{ '--stagger': staggerIndex(index) } as CSSProperties}
        className='transition-transform stagger-delay duration-slow ease-reveal'>
        {children}
      </div>
    </div>
  );
}
