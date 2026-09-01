'use client';

import { useRef, type ReactNode } from 'react';
import { ScrollSmoother, gsap, useGSAP } from '@/lib/motion/gsap';

/** ScrollSmoother가 요구하는 두 겹을 깔아, 그 안의 스크롤을 관성 있게 만든다. */
export function ScrollStage({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      // 터치 기기에선 스무더가 관성은 못 주면서 핀만 transform 방식으로 바꿔 놓아, 아예 안 만든다
      media.add(
        '(prefers-reduced-motion: no-preference) and (pointer: fine)',
        () => {
          // smooth 1.2가 스크롤을 따라잡는 데 쓰는 초. 키우면 더 미끄럽고 늦게 멈춘다
          // speed 0.5는 휠 한 번이 굴리는 거리 배수. 줄이면 천천히 내려가고 키우면 성큼 뛴다
          // effects를 끄면 자식의 data-speed 패럴랙스가 함께 죽는다
          ScrollSmoother.create({ smooth: 1.2, speed: 0.5, effects: true });
        }
      );

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
