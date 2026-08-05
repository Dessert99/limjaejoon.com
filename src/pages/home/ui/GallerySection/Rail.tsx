'use client';

/** Gallery 의 가로 rail 한 줄 — 세로 스크롤 진행률을 가로 이동으로 바꾼다. 트랙의 x 만 소유한다 */
import { useRef } from 'react';
import { Media, type MediaRatio } from '@/shared/ui';
import { gsap, useGSAP } from '@/shared/motion';

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

      const root = rootRef.current;

      if (!root) {
        return;
      }

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 넘치는 만큼만 움직인다 — 고정 비율이면 넘침이 클수록 끝 항목이 영원히 화면에 안 나온다
        const overflow = (target: Element): number => {
          return Math.max(0, target.scrollWidth - root.clientWidth);
        };

        // 두 줄이 반대로 흘러야 한다 — 같은 방향이면 그냥 미끄러지는 것처럼만 보인다
        const isReverse = direction === 'reverse';

        gsap.fromTo(
          '[data-rail]',
          {
            x: (_index: number, target: Element) => {
              return isReverse ? -overflow(target) : 0;
            },
          },
          {
            x: (_index: number, target: Element) => {
              return isReverse ? 0 : -overflow(target);
            },
            // 스크롤 위치와 가로 위치를 선형으로 묶는다 — 이징이 끼면 스크럽이 고르지 않다
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              // 폭이 바뀌면 실측을 다시 한다 — 리사이즈 뒤에도 끝 항목이 화면에 닿는다
              invalidateOnRefresh: true,
            },
          }
        );
      });

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    // 수동 가로 스크롤을 열지 않는다 — 이동량이 넘침 전체를 덮어 모든 항목이 한 번씩 지나간다
    // 스크롤 영역이 아니므로 tabIndex 도 두지 않는다(초점만 받고 할 일이 없는 요소가 된다)
    <div
      ref={rootRef}
      role='group'
      aria-label={label}
      className='overflow-hidden'>
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
