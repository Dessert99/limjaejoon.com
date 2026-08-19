'use client';

import { useRef } from 'react';
import { ScrollTrigger, gsap, useGSAP } from '@/lib/motion/gsap';

const SPEED = 90;

const COPY_COUNT = 4;

const REWIND_CYCLES = 100;

const COPY_CLASS = 'whitespace-nowrap text-hero leading-[1.15] font-medium';

type HeroMarqueeProps = {
  text: string;
  titleId: string;
};

export function HeroMarquee({ text, titleId }: HeroMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const copy = rootRef.current?.querySelector('[data-marquee-copy]');

        if (!copy) {
          return;
        }

        const span = copy.getBoundingClientRect().width;

        const spin: gsap.core.Tween = gsap.to('[data-marquee-track]', {
          x: `-=${span}`,
          modifiers: { x: gsap.utils.unitize(gsap.utils.wrap(-span, 0)) },
          duration: span / SPEED,
          ease: 'none',
          repeat: -1,
          onReverseComplete: () => {
            return spin.totalTime(
              spin.rawTime() + spin.duration() * REWIND_CYCLES
            );
          },
        });

        ScrollTrigger.create({
          onUpdate: (self) => {
            spin.timeScale(self.direction);
          },
        });
      });

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className='relative overflow-hidden text-foreground mix-blend-difference'>
      <div
        data-marquee-track
        className='flex w-max'>
        <h1
          id={titleId}
          data-marquee-copy
          className={COPY_CLASS}>
          {text}
          <Separator />
        </h1>

        {Array.from({ length: COPY_COUNT - 1 }, (_, index) => {
          return (
            <span
              key={index}
              aria-hidden='true'
              className={COPY_CLASS}>
              {text}
              <Separator />
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <span
      aria-hidden='true'
      className='px-[0.5em] text-[1em]'>
      -
    </span>
  );
}
