'use client';

import { useRef } from 'react';
import { ScrollTrigger, gsap, useGSAP } from '@/lib/motion/gsap';

type HeroMarqueeProps = {
  text: string;
  titleId: string;
};

/** 바닥을 가로지르는 무한 흐름 문구. 스크롤을 거스르면 흐르는 방향도 뒤집힌다. */
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

        // 복사본 하나의 폭이 곧 이음매 없이 되감을 수 있는 주기다
        const span = copy.getBoundingClientRect().width;

        const spin: gsap.core.Tween = gsap.to('[data-marquee-track]', {
          x: `-=${span}`,
          // 한 주기를 넘어간 x를 되감아 트랙이 실제로는 제자리에서 맴돌게 한다
          modifiers: { x: gsap.utils.unitize(gsap.utils.wrap(-span, 0)) },
          // 나누는 90이 초당 흐르는 픽셀. 키우면 글자가 빨리 지나간다
          duration: span / 90,
          // 등속이라야 이음매에서 속도가 튀지 않는다
          ease: 'none',
          repeat: -1,
          // 역방향 재생이 시작점에 닿아 멈추지 않게 100바퀴를 미리 감아둔다
          onReverseComplete: () => {
            return spin.totalTime(spin.rawTime() + spin.duration() * 100);
          },
        });

        ScrollTrigger.create({
          // direction이 1/-1이라 스크롤을 거슬러 올리면 마퀴도 거꾸로 흐른다
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
    // mix-blend-difference라 사진의 밝은 곳에서는 글자가 반전돼 읽힌다
    <div
      ref={rootRef}
      className='relative overflow-hidden text-home-foreground mix-blend-difference'>
      <div
        data-marquee-track
        className='flex w-max'>
        <h1
          id={titleId}
          data-marquee-copy
          className='px-[0.7em] text-hero leading-[1.15] font-medium whitespace-nowrap'>
          {text}
        </h1>

        {/* h1 포함 4벌이면 가장 넓은 화면도 덮는다. 줄이면 되감는 순간 꼬리가 빈다 */}
        {Array.from({ length: 4 - 1 }, (_, index) => {
          return (
            <span
              key={index}
              aria-hidden='true'
              className='px-[0.7em] text-hero leading-[1.15] font-medium whitespace-nowrap'>
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
