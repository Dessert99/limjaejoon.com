'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

const GREETING = `안녕하세요.\n프론트엔드 개발자,\n임재준입니다.`;

let played = false;

const OVERLAY_CLASS =
  'fixed inset-0 z-(--z-transition) flex items-center justify-center bg-home-background px-home-gutter motion-reduce:hidden';

const TEXT_CLASS =
  'font-display text-home-intro text-home-foreground text-balance whitespace-pre-line text-center';

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
            duration: 2,
            ease: 'none',
            chars: GREETING.length,
            onUpdate: () => {
              text.textContent = GREETING.slice(0, Math.round(typed.chars));
            },
          })
          .fromTo(
            root,
            { borderRadius: '0% 0% 0% 0%' },
            {
              yPercent: -100,
              borderRadius: '0% 0% 50% 50%',
              duration: 1.2,
              ease: 'power2.inOut',
            },
            '+=0.5'
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
