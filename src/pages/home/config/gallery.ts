/** Gallery 섹션 — 실물 에셋이 없어 자리표시 목록이다. 실물이 들어오면 src 만 채우면 된다 */
import type { MediaRatio } from '@/shared/ui';

type GalleryItem = {
  id: string;
  src: string | null;
  alt: string;
  ratio: MediaRatio;
};

export const GALLERY = {
  label: 'Gallery',
  title: '작업하는 동안 남은 것들',
} as const;

/* 줄당 4장 — 화면보다 넓어야 좌우로 흐르는 게 보인다 */
export const GALLERY_ROWS: GalleryItem[][] = [
  [1, 2, 3, 4].map((n) => {
    return {
      id: `top-${n}`,
      src: null,
      alt: `작업 기록 ${n}`,
      ratio: 'gallery' as const,
    };
  }),
  [5, 6, 7, 8].map((n) => {
    return {
      id: `bottom-${n}`,
      src: null,
      alt: `작업 기록 ${n}`,
      ratio: 'gallery' as const,
    };
  }),
];
