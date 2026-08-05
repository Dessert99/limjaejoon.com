'use client';

/** Hero 하단 마퀴 — 같은 문구를 우→좌로 무한히 흘린다. 트랙의 x 만 소유한다 */
import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib';

/** 초당 이동 픽셀 — 문구가 길어져도 체감 속도가 같게 duration 을 실측 폭에서 계산한다 */
const SPEED = 90;

/** 복사본 수 — 한 벌은 되감기에 쓰이므로 나머지가 화면을 덮어야 이음매가 안 보인다 */
const COPY_COUNT = 4;

/* leading 은 text-hero 의 0.9 를 덮는다 — 줄 상자가 글자보다 낮아 쉼표가 overflow 에 잘린다 */
const COPY_CLASS = 'whitespace-nowrap text-hero leading-[1.15] font-medium';

type HeroMarqueeProps = {
  text: string;
  titleId: string;
};

/** 한 벌을 흘린다 — h1 은 첫 벌뿐이고 나머지는 같은 글자를 다시 읽히지 않게 숨긴다 */
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

        // 한 벌 폭만큼 민 뒤 되감는다 — 복사본이 같아 되감는 순간이 눈에 띄지 않는다
        const span = copy.getBoundingClientRect().width;

        gsap.to('[data-marquee-track]', {
          x: `-=${span}`,
          modifiers: { x: gsap.utils.unitize(gsap.utils.wrap(-span, 0)) },
          duration: span / SPEED,
          ease: 'none',
          repeat: -1,
        });
      });

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    // difference 는 같은 stacking context 의 배경하고만 섞인다 — z-index 래퍼에 넣으면 사진이 배경에서 빠진다
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

/** 벌 사이 구분자 — 글자가 아니라 리듬이라 낭독 대상이 아니다 */
function Separator() {
  return (
    // em 단위라 문구 크기를 따라간다 — 본문 글자보다 작아야 경계 표시로 읽히고 단어로 안 읽힌다
    <span
      aria-hidden='true'
      className='px-[0.5em] text-[1em]'>
      -
    </span>
  );
}
