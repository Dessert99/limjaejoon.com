'use client';

import { useRef, type ReactNode } from 'react';
import { ScrollSmoother, gsap, useGSAP } from '@/lib/motion/gsap';

/** ScrollSmoother가 요구하는 두 겹을 깔아, 그 안의 스크롤을 관성 있게 만든다. */
export function ScrollStage({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // smooth 1.2가 스크롤을 따라잡는 데 쓰는 초. 키우면 더 미끄럽고 늦게 멈춘다
        // effects를 끄면 자식의 data-speed 패럴랙스가 함께 죽는다
        ScrollSmoother.create({ smooth: 1.2, effects: true });
      });

      return () => {
        return media.revert();
      };
    },
    { scope: wrapperRef }
  );

  return (
    <div
      id='smooth-wrapper'
      ref={wrapperRef}>
      <div id='smooth-content'>{children}</div>
    </div>
  );
}
