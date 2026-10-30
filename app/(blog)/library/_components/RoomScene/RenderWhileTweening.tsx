'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { gsap } from '@/lib/motion/gsap';

/** GSAP 트윈이 도는 동안에만 방을 다시 그린다. 트윈은 three 객체를 직접 바꿔 r3f가 스스로 알아채지 못한다. */
export function RenderWhileTweening() {
  const advance = useThree((state) => {
    return state.advance;
  });

  useEffect(() => {
    let busy = false;
    const tick = () => {
      // 루트 타임라인에는 ScrollTrigger가 걸어 둔 멈춘 예약 트윈이 늘 남아 있어, 재생 중인 것만 센다
      // 창문 SVG의 무한 반복(data 'dom')은 캔버스와 무관하니 빼야 방이 멈춰 있을 수 있다
      const now = gsap.globalTimeline.getChildren(false).some((child) => {
        return child.isActive() && child.data !== 'dom';
      });

      // invalidate는 다음 rAF로 미뤄져 루프가 멈췄다 다시 도는 사이 한 프레임씩 걸러 그린다. 이 틱에서 바로 그린다
      // 끝난 틱에는 이미 빠져 있어 마지막 자세가 안 그려지므로 한 프레임 더 그린다
      if (now || busy) {
        advance(performance.now());
      }
      busy = now;
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [advance]);

  return null;
}
