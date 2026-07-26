/** 스크롤을 배경의 수평 이동으로 바꾸는 훅 — 이 레포에서 GSAP 을 아는 유일한 파일 */
'use client';

import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/shared/lib/gsap';
import { bp } from '@/shared/styles/breakpoints';
import { layerShift, resolveParallaxConfig } from './parallax';
import type { Scene } from './types';

/** 훅 인자 — 핀 대상과 애니메이션 스코프를 분리해 위젯이 특정 페이지에 묶이지 않게 한다 */
export interface HorizontalParallaxOptions {
  scene: Scene;
  sectionRef: RefObject<HTMLElement | null>;
  scopeRef: RefObject<HTMLElement | null>;
}

/** 섹션을 핀하고 그동안의 스크롤을 겹별 수평 이동으로 변환한다 */
export function useHorizontalParallax({
  scene,
  sectionRef,
  scopeRef,
}: HorizontalParallaxOptions): void {
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const mm = gsap.matchMedia();

      // 브레이크포인트와 reduced-motion 을 같은 문법으로 다루고, 조건이 바뀌면 GSAP 이 되돌린다
      mm.add(
        { isDesktop: bp.md, reduceMotion: '(prefers-reduced-motion: reduce)' },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };

          const config = resolveParallaxConfig({ isDesktop, reduceMotion });
          if (!config) {
            return;
          }

          const travel = window.innerWidth * config.travelRatio;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${travel}`,
              pin: config.pin,
              scrub: true,
              // 화면 회전·리사이즈 후 travel 을 다시 계산하지 않으면 이동 폭이 어긋난다
              invalidateOnRefresh: true,
            },
          });

          for (const layer of scene.layers) {
            timeline.to(
              `[data-layer-id="${layer.id}"]`,
              { x: layerShift(layer.depth, 1, travel), ease: 'none' },
              0
            );
          }
        }
      );
    },
    { scope: scopeRef, dependencies: [scene] }
  );
}
