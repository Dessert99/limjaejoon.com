'use client';

/** 마스크 등장 — 바깥이 overflow, 안쪽이 translate 를 소유한다(한 엘리먼트가 둘 다 잡지 않는다) */
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { cn, staggerIndex, useInView } from '@/shared/lib';

/** ref 는 열지 않는다 — 루트 ref 는 관찰자 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
/* staggerIndex 는 지연 "값" 이 아니라 배수다 — 실제 지연은 CSS 가 계산한다 */
type MaskRevealProps = ComponentPropsWithoutRef<'div'> & {
  staggerIndex?: number;
  once?: boolean;
  trigger?: 'view' | 'mount';
};

/** 블록 콘텐츠가 아래에서 밀려 올라오는 등장 — 글자 크기 클래스는 자식이 아니라 이 컴포넌트에 건다(오버행이 em 기준) */
/* trigger='mount' 는 Hero 처럼 늘 화면 안에 있는 자리용이다. 뷰포트 트리거로는 관찰자가 곧장 in 을 보고해 아무 일도 안 일어난다 */
export function MaskReveal({
  staggerIndex: index = 0,
  once = true,
  trigger = 'view',
  className,
  children,
  ...rest
}: MaskRevealProps) {
  const isView = trigger === 'view';
  const [ref, state] = useInView<HTMLDivElement>({ once, enabled: isView });

  return (
    <div
      ref={ref}
      className={cn('mask-track', className)}
      {...rest}>
      <div
        // idle 에 해당하는 CSS 규칙은 없다 — 서버 렌더와 미지원 환경이 이 상태에 머물러 콘텐츠가 남는다
        data-reveal={isView ? state : undefined}
        // mount 는 CSS 애니메이션이라 JS 상태가 없다 — 서버 렌더 마크업이 그대로고 스크립트가 죽어도 최종 상태로 선다
        data-enter={isView ? undefined : ''}
        style={{ '--stagger': staggerIndex(index) } as CSSProperties}
        className={cn(
          isView &&
            'transition-transform stagger-delay duration-slow ease-reveal'
        )}>
        {children}
      </div>
    </div>
  );
}
