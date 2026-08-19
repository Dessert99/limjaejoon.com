'use client';

import { useRef, type ReactNode } from 'react';
import { ScrollSmoother, gsap, useGSAP } from '@/lib/motion/gsap';
import { MOTION } from '../../lib/motionPreset';

export function ScrollStage({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollSmoother.create({ smooth: MOTION.smooth, effects: true });
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
