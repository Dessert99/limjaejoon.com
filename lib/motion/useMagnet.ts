'use client';

import { type RefObject, useRef } from 'react';
import { gsap, useGSAP } from './gsap';

const STRENGTH = 0.4;

export const useMagnet = <T extends HTMLElement>(
  areaRef?: RefObject<HTMLElement | null>
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const element = ref.current;
      const area = areaRef ? areaRef.current : element;

      if (!element || !area) {
        return;
      }

      const media = gsap.matchMedia();

      media.add(
        '(prefers-reduced-motion: no-preference) and (hover: hover)',
        () => {
          const pull = (event: PointerEvent): void => {
            const box = element.getBoundingClientRect();
            const shiftX = gsap.getProperty(element, 'x') as number;
            const shiftY = gsap.getProperty(element, 'y') as number;
            const centerX = box.left + box.width / 2 - shiftX;
            const centerY = box.top + box.height / 2 - shiftY;

            gsap.to(element, {
              x: (event.clientX - centerX) * STRENGTH,
              y: (event.clientY - centerY) * STRENGTH,
              duration: 0.4,
              ease: 'power3.out',
            });
          };

          const release = (): void => {
            gsap.to(element, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: 'elastic.out(1, 0.4)',
            });
          };

          area.addEventListener('pointermove', pull);
          area.addEventListener('pointerleave', release);

          return () => {
            area.removeEventListener('pointermove', pull);
            area.removeEventListener('pointerleave', release);
          };
        }
      );

      return () => {
        return media.revert();
      };
    },
    { scope: ref }
  );

  return ref;
};
