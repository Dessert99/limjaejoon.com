'use client';

/** 스크롤 무대 — ScrollSmoother 만 소유한다. 다른 컴포넌트의 애니메이션을 대신 등록하지 않는다 */
import { useRef, type ReactNode } from 'react';
import { ScrollSmoother, gsap, useGSAP } from '@/lib/motion/gsap';
import { MOTION } from '../../lib/motionPreset';

/** 홈 전체를 감싸 관성을 건다 — children 으로 받아 섹션을 서버 컴포넌트로 남긴다 */
export function ScrollStage({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      // 감쇠에서는 만들지 않는다 — 생성 자체를 안 하므로 되돌릴 것이 없다
      media.add('(prefers-reduced-motion: no-preference)', () => {
        ScrollSmoother.create({ smooth: MOTION.smooth, effects: true });
      });

      return () => {
        return media.revert();
      };
    },
    { scope: wrapperRef }
  );

  // ID 는 GSAP 기본값이다 — 옵션으로 넘기지 않고 이 이름을 그대로 쓴다
  return (
    <div
      id='smooth-wrapper'
      ref={wrapperRef}>
      <div id='smooth-content'>{children}</div>
    </div>
  );
}
