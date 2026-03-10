import type { CSSProperties } from 'react';

import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'filter-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
    },
    itemA: {
      width: '220px',
      minHeight: '120px',
      background:
        'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(99, 102, 241, 0.95))',
      color: '#f8fafc',
      '--filter-blur': '0px',
      '--filter-brightness': '100%',
      filter: 'blur(var(--filter-blur)) brightness(var(--filter-brightness))',
    } as CSSProperties,
  },
  'filter-tone': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
    },
    itemA: {
      width: '220px',
      minHeight: '120px',
      background:
        'linear-gradient(135deg, rgba(16, 185, 129, 0.92), rgba(34, 197, 94, 0.92))',
      color: '#052e16',
      '--filter-grayscale': '0%',
      '--filter-contrast': '110%',
      filter: 'grayscale(var(--filter-grayscale)) contrast(var(--filter-contrast))',
    } as CSSProperties,
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'filter-blur-0': { itemA: { '--filter-blur': '0px' } as CSSProperties },
  'filter-blur-2': { itemA: { '--filter-blur': '2px' } as CSSProperties },
  'filter-blur-6': { itemA: { '--filter-blur': '6px' } as CSSProperties },
  'filter-brightness-80': {
    itemA: { '--filter-brightness': '80%' } as CSSProperties,
  },
  'filter-brightness-100': {
    itemA: { '--filter-brightness': '100%' } as CSSProperties,
  },
  'filter-brightness-130': {
    itemA: { '--filter-brightness': '130%' } as CSSProperties,
  },
  'filter-grayscale-0': {
    itemA: { '--filter-grayscale': '0%' } as CSSProperties,
  },
  'filter-grayscale-50': {
    itemA: { '--filter-grayscale': '50%' } as CSSProperties,
  },
  'filter-grayscale-100': {
    itemA: { '--filter-grayscale': '100%' } as CSSProperties,
  },
  'filter-contrast-90': {
    itemA: { '--filter-contrast': '90%' } as CSSProperties,
  },
  'filter-contrast-110': {
    itemA: { '--filter-contrast': '110%' } as CSSProperties,
  },
  'filter-contrast-140': {
    itemA: { '--filter-contrast': '140%' } as CSSProperties,
  },
};

export const filterPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
