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

      // 브레이크포인트와 reduced-motion 을 같은 문법으로 다루고, 조건이 바뀌면 GSAP 이 되돌린다.
      // isMobile 은 쓰지 않지만 빠뜨리면 안 된다 — 매치되는 조건이 하나도 없으면 콜백이 아예 안 돈다.
      mm.add(
        {
          isDesktop: bp.md,
          isMobile: bp.belowMd,
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };

          const config = resolveParallaxConfig({ isDesktop, reduceMotion });
          if (!config) {
            return;
          }

          // 상수로 굳히면 같은 브레이크포인트 안에서 리사이즈했을 때 옛 폭이 남는다.
          // 함수로 두면 invalidateOnRefresh 가 refresh 시점에 다시 부른다.
          const travel = () => {
            return window.innerWidth * config.travelRatio;
          };

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => {
                return `+=${travel()}`;
              },
              pin: config.pin,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          for (const layer of scene.layers) {
            timeline.to(
              `[data-layer-id="${layer.id}"]`,
              {
                x: () => {
                  return layerShift(layer.depth, 1, travel());
                },
                ease: 'none',
              },
              0
            );
          }
        }
      );
    },
    { scope: scopeRef, dependencies: [scene] }
  );
}
