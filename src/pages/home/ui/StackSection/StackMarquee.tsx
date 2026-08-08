'use client';

/** 스택 마퀴 — 두 줄이 서로 반대로 흐른다. 히어로 마퀴와 달리 스크롤과 무관하게 일정한 속도다 */
import { useRef } from 'react';
import { STACK_MARQUEE } from '../../config/stack';
import { StackChip } from './StackChip';
import { gsap, useGSAP } from '@/shared/motion';

/** 초당 이동 픽셀 — 히어로 마퀴보다 느리다. 칩 글자가 작아 같은 속도면 못 읽는다 */
const SPEED = 45;

/** 복사본 수 — 한 벌은 되감기에 쓰이므로 나머지가 화면을 덮어야 이음매가 안 보인다 */
const COPY_COUNT = 4;

/* 복사본 폭이 곧 반복 주기다 — 줄 간격을 트랙에 주면 주기와 어긋나 되감는 순간 틈이 보인다. 여백은 복사본 안에 둔다 */
const COPY_CLASS = 'flex shrink-0 gap-3 pr-3';

export function StackMarquee() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tracks = rootRef.current?.querySelectorAll<HTMLElement>(
        '[data-marquee-track]'
      );

      if (!tracks) {
        return;
      }

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        for (const track of tracks) {
          const copy = track.querySelector('[data-marquee-copy]');

          if (!copy) {
            continue;
          }

          // 한 벌 폭만큼 밀고 처음으로 되돌린다 — 복사본이 같아 되감는 순간이 눈에 띄지 않는다
          const span = copy.getBoundingClientRect().width;
          const back = track.dataset.marqueeTrack === 'back';

          gsap.fromTo(
            track,
            { x: back ? -span : 0 },
            {
              x: back ? 0 : -span,
              duration: span / SPEED,
              ease: 'none',
              repeat: -1,
            }
          );
        }
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
      className='mt-section-sm flex flex-col gap-3 overflow-hidden'>
      {STACK_MARQUEE.map((row, rowIndex) => {
        return (
          <div
            key={rowIndex}
            data-marquee-track={rowIndex % 2 === 1 ? 'back' : 'forth'}
            className='flex w-max'>
            {Array.from({ length: COPY_COUNT }, (_, copyIndex) => {
              // 첫 벌만 읽힌다 — 나머지는 같은 기술명을 스크린 리더가 네 번 부르지 않게 숨긴다
              const repeat = copyIndex > 0;

              return (
                <ul
                  key={copyIndex}
                  data-marquee-copy=''
                  aria-hidden={repeat || undefined}
                  className={COPY_CLASS}>
                  {row.map((name) => {
                    return (
                      <li key={name}>
                        <StackChip name={name} />
                      </li>
                    );
                  })}
                </ul>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
