'use client';

import { useRef, type PointerEventHandler, type RefObject } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

export const MAGNETIC_PULL = 0.35;

export const MAGNETIC_FOLLOW = { duration: 0.4, ease: 'power3.out' } as const;

const RETURN = { duration: 1.1, ease: 'elastic.out(1, 0.32)' } as const;

export type Magnetic<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  onPointerEnter: PointerEventHandler<T>;
  onPointerMove: PointerEventHandler<T>;
  onPointerLeave: PointerEventHandler<T>;
};

export const useMagnetic = <T extends HTMLElement>(): Magnetic<T> => {
  const ref = useRef<T>(null);
  const followRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(
    null
  );
  const returnRef = useRef<gsap.core.Tween | null>(null);
  const enabledRef = useRef(false);

  useGSAP(() => {
    const element = ref.current;
    const media = gsap.matchMedia();

    media.add(
      '(prefers-reduced-motion: no-preference) and (hover: hover)',
      () => {
        enabledRef.current = true;

        return () => {
          enabledRef.current = false;
        };
      }
    );

    return () => {
      if (element) {
        gsap.killTweensOf(element);
      }

      media.revert();
    };
  });

  return {
    ref,
    onPointerEnter: (event) => {
      if (!enabledRef.current) {
        return;
      }

      returnRef.current?.kill();
      returnRef.current = null;

      followRef.current = {
        x: gsap.quickTo(event.currentTarget, 'x', MAGNETIC_FOLLOW),
        y: gsap.quickTo(event.currentTarget, 'y', MAGNETIC_FOLLOW),
      };
    },

    onPointerMove: (event) => {
      const follow = followRef.current;

      if (!follow) {
        return;
      }

      const box = event.currentTarget.getBoundingClientRect();

      follow.x((event.clientX - (box.left + box.width / 2)) * MAGNETIC_PULL);
      follow.y((event.clientY - (box.top + box.height / 2)) * MAGNETIC_PULL);
    },

    onPointerLeave: (event) => {
      if (!followRef.current) {
        return;
      }

      followRef.current = null;

      returnRef.current = gsap.to(event.currentTarget, {
        x: 0,
        y: 0,
        ...RETURN,
        overwrite: true,
      });
    },
  };
};
