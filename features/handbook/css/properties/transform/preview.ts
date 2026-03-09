import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'transform-move-scale': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
    },
    itemA: {
      width: '180px',
      minHeight: '100px',
      transform: 'translateX(0px) scale(1)',
      transformOrigin: 'center',
      background: '#2563eb',
      color: '#f8fafc',
    },
  },
  'transform-rotate-skew': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
    },
    itemA: {
      width: '200px',
      minHeight: '100px',
      transform: 'rotate(0deg) skewX(0deg)',
      background: '#16a34a',
      color: '#f8fafc',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'transform-none': { itemA: { transform: 'translateX(0px) scale(1)' } },
  'transform-move': { itemA: { transform: 'translateX(24px) scale(1)' } },
  'transform-scale-up': { itemA: { transform: 'translateX(0px) scale(1.25)' } },
  'transform-move-scale': {
    itemA: { transform: 'translateX(24px) scale(1.25)' },
  },
  'origin-center': { itemA: { transformOrigin: 'center' } },
  'origin-left-top': { itemA: { transformOrigin: 'left top' } },
  'origin-right-bottom': { itemA: { transformOrigin: 'right bottom' } },
  'rotate-skew-none': { itemA: { transform: 'rotate(0deg) skewX(0deg)' } },
  'rotate-only-15': { itemA: { transform: 'rotate(15deg) skewX(0deg)' } },
  'skew-only-20': { itemA: { transform: 'rotate(0deg) skewX(20deg)' } },
  'rotate-skew-combo': { itemA: { transform: 'rotate(15deg) skewX(20deg)' } },
};

export const transformPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
