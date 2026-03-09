import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'opacity-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '240px',
      minHeight: '100px',
      background: '#2563eb',
      color: '#f8fafc',
      opacity: 1,
    },
  },
  'opacity-layer': {
    container: {
      position: 'relative',
      display: 'block',
      width: '100%',
      minHeight: '240px',
    },
    itemA: {
      position: 'absolute',
      top: '38px',
      left: '78px',
      width: '180px',
      minHeight: '120px',
      background: 'blue',
      color: '#f8fafc',
      opacity: 0.75,
      zIndex: 2,
    },
    itemB: {
      position: 'absolute',
      top: '82px',
      left: '152px',
      width: '180px',
      minHeight: '120px',
      background: '#22c55e',
      color: '#052e16',
      zIndex: 1,
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'opacity-100': { itemA: { opacity: 1 } },
  'opacity-70': { itemA: { opacity: 0.7 } },
  'opacity-40': { itemA: { opacity: 0.4 } },
  'opacity-15': { itemA: { opacity: 0.15 } },
  'front-opacity-100': { itemA: { opacity: 1 } },
  'front-opacity-75': { itemA: { opacity: 0.75 } },
  'front-opacity-45': { itemA: { opacity: 0.45 } },
  'front-opacity-20': { itemA: { opacity: 0.2 } },
  'front-color-blue': { itemA: { background: 'blue' } },
  'front-color-red': { itemA: { background: 'red' } },
  'front-color-black': { itemA: { background: 'black' } },
};

export const opacityPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
