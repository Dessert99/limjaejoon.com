/** Gallery 의 가로 rail 한 줄 — 세로 스크롤 진행률을 가로 이동으로 바꾼다 */
import { Media, type MediaRatio } from '@/shared/ui';

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
  return (
    // overflow-x-auto + tabindex — 애니메이션이 꺼져도 좌우로 직접 훑을 수 있어야 정보가 안 빠진다
    <div
      role='group'
      aria-label={label}
      tabIndex={0}
      className='overflow-x-auto'>
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
