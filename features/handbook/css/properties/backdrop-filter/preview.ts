import type { CSSProperties } from 'react';

import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const patternBackground =
  'radial-gradient(circle at 24% 24%, rgba(96, 165, 250, 0.42), transparent 42%), radial-gradient(circle at 72% 38%, rgba(251, 146, 60, 0.34), transparent 44%), linear-gradient(140deg, #0f172a, #111827 55%, #1f2937)';

const presetStyleMap: PreviewPresetStyleMap = {
  'backdrop-filter-glass': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
      background: patternBackground,
      padding: '24px',
    },
    itemA: {
      width: '240px',
      minHeight: '128px',
      color: '#f8fafc',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      background: 'rgba(15, 23, 42, 0.42)',
      '--backdrop-blur': '6px',
      backdropFilter: 'blur(var(--backdrop-blur))',
    } as CSSProperties,
  },
  'backdrop-filter-mix': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
      background: patternBackground,
      padding: '24px',
    },
    itemA: {
      width: '240px',
      minHeight: '128px',
      color: '#f8fafc',
      border: '1px solid rgba(255, 255, 255, 0.28)',
      background: 'rgba(15, 23, 42, 0.36)',
      '--backdrop-blur': '8px',
      '--backdrop-saturate': '140%',
      backdropFilter: 'blur(var(--backdrop-blur)) saturate(var(--backdrop-saturate))',
    } as CSSProperties,
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'backdrop-blur-0': { itemA: { '--backdrop-blur': '0px' } as CSSProperties },
  'backdrop-blur-6': { itemA: { '--backdrop-blur': '6px' } as CSSProperties },
  'backdrop-blur-12': { itemA: { '--backdrop-blur': '12px' } as CSSProperties },
  'backdrop-mix-blur-2': {
    itemA: { '--backdrop-blur': '2px' } as CSSProperties,
  },
  'backdrop-mix-blur-8': {
    itemA: { '--backdrop-blur': '8px' } as CSSProperties,
  },
  'backdrop-mix-blur-14': {
    itemA: { '--backdrop-blur': '14px' } as CSSProperties,
  },
  'backdrop-saturate-100': {
    itemA: { '--backdrop-saturate': '100%' } as CSSProperties,
  },
  'backdrop-saturate-140': {
    itemA: { '--backdrop-saturate': '140%' } as CSSProperties,
  },
  'backdrop-saturate-180': {
    itemA: { '--backdrop-saturate': '180%' } as CSSProperties,
  },
};

export const backdropFilterPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
