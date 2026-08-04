'use client';

/** Gallery 의 가로 rail 한 줄 — 세로 스크롤 진행률을 가로 이동으로 바꾼다. 트랙의 x 만 소유한다 */
import { useRef } from 'react';
import { Media, type MediaRatio } from '@/shared/ui';
import { MOTION, gsap, useGSAP } from '../../lib';

/** rail 항목 한 건 — config 의 GalleryItem 이 구조적으로 이 형태다 */
export interface RailItem {
  id: string;
  src: string | null;
  alt: string;
  ratio: MediaRatio;
}

type RailProps = {
  direction: 'forward' | 'reverse';
  label: string;
  items: RailItem[];
};

/** 한 줄을 그린다 — 흐름 방향만 다르고 배치는 두 줄이 같다 */
export function Rail({ direction, label, items }: RailProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 두 줄이 반대로 흘러야 한다 — 같은 방향이면 그냥 미끄러지는 것처럼만 보인다
        const from =
          direction === 'reverse' ? -MOTION.railDistance : MOTION.railDistance;

        gsap.fromTo(
          '[data-rail]',
          { xPercent: from },
          {
            xPercent: -from,
            // 스크롤 위치와 가로 위치를 선형으로 묶는다 — 이징이 끼면 스크럽이 고르지 않다
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return (
    // overflow-x-auto + tabindex — 애니메이션이 꺼져도 좌우로 직접 훑을 수 있어야 정보가 안 빠진다
    <div
      ref={rootRef}
      role='group'
      aria-label={label}
      tabIndex={0}
      className='overflow-x-auto'>
      {/* 값은 GallerySection 이 정한 교대를 드러내고, 존재 자체는 감쇠에서 한 줄을 그리드로 접는 셀렉터가 쓴다 */}
      <div
        data-rail={direction === 'reverse' ? 'reverse' : ''}
        className='flex w-max gap-grid-gap px-gutter'>
        {items.map((item) => {
          return (
            <Media
              key={item.id}
              src={item.src}
              alt={item.alt}
              ratio={item.ratio}
              sizes='(min-width: 48rem) 40vw, 80vw'
              className='w-rail-item shrink-0 rounded-md'
            />
          );
        })}
      </div>
    </div>
  );
}
