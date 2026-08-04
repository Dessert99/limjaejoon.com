'use client';

/** 마스크 등장 — 바깥이 overflow, 안쪽이 y 를 소유한다(한 엘리먼트가 둘 다 잡지 않는다) */
import { useRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/lib';
import { MOTION, gsap, staggerIndex, useGSAP } from '../../lib';

/** ref 는 열지 않는다 — 루트 ref 는 애니메이션 scope 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
type MaskRevealProps = ComponentPropsWithoutRef<'div'> & {
  staggerIndex?: number;
  once?: boolean;
  trigger?: 'view' | 'mount';
};

/** 블록 콘텐츠가 아래에서 밀려 올라오는 등장 — 글자 크기 클래스는 자식이 아니라 이 컴포넌트에 건다(오버행이 em 기준) */
/* trigger='mount' 는 Hero 처럼 늘 화면 안에 있는 자리용이다 — 뷰포트 트리거로는 곧장 발동해 아무 일도 안 일어난다 */
export function MaskReveal({
  staggerIndex: index = 0,
  once = true,
  trigger = 'view',
  className,
  children,
  ...rest
}: MaskRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const step = staggerIndex(index);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 오버행만큼 더 내려야 한다 — 100% 만 내리면 디센더 여백에 글자 윗동이 비친다
        const overhang =
          getComputedStyle(root).getPropertyValue('--mask-overhang').trim() ||
          '0px';

        gsap.from('[data-reveal]', {
          yPercent: 100,
          y: overhang,
          duration: MOTION.duration.reveal,
          ease: MOTION.ease.reveal,
          delay: step * MOTION.stagger.step,
          scrollTrigger:
            trigger === 'view'
              ? { trigger: root, start: 'top 85%', once }
              : undefined,
        });
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className={cn('mask-track', className)}
      {...rest}>
      {/* 은닉 스타일이 마크업에 없다 — gsap.from 이 마운트 뒤에 시작 상태를 심는다 */}
      <div
        data-reveal=''
        data-stagger={step}>
        {children}
      </div>
    </div>
  );
}
