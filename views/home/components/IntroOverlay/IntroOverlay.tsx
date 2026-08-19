'use client';

import { useEffect, useRef, useState } from 'react';
import { INTRO_GREETING } from '../../config/intro';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { MOTION } from '../../lib/motionPreset';

const TYPING = { duration: 2, ease: 'none' } as const;

const HOLD = 0.5;

const CURVE = { flat: '0% 0% 0% 0%', bottom: '0% 0% 50% 50%' } as const;

let played = false;

const OVERLAY_CLASS =
  'fixed inset-0 z-(--ds-z-transition) flex items-center justify-center bg-background px-gutter motion-reduce:hidden';

const TEXT_CLASS =
  'font-display text-section text-foreground text-balance whitespace-pre-line text-center';

export function IntroOverlay() {
  const [visible] = useState(() => {
    return !played;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    played = true;
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const text = textRef.current;

      if (!root || !text) {
        return;
      }

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const typed = { chars: 0 };

        gsap
          .timeline()
          .to(typed, {
            ...TYPING,
            chars: INTRO_GREETING.length,
            onUpdate: () => {
              text.textContent = INTRO_GREETING.slice(
                0,
                Math.round(typed.chars)
              );
            },
          })
          .fromTo(
            root,
            { borderRadius: CURVE.flat },
            {
              yPercent: -100,
              borderRadius: CURVE.bottom,
              duration: MOTION.duration.cinematic,
              ease: MOTION.ease.cinematic,
            },
            `+=${HOLD}`
          );
      });

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  if (!visible) {
    return null;
  }

  return (
    <>
      <noscript>
        <style>{'[data-intro-overlay]{display:none}'}</style>
      </noscript>

      <div
        ref={rootRef}
        data-intro-overlay=''
        data-testid='intro-overlay'
        aria-hidden='true'
        className={OVERLAY_CLASS}>
        <span
          ref={textRef}
          className={TEXT_CLASS}
        />
      </div>
    </>
  );
}
