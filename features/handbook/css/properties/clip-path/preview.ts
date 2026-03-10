import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'clip-path-shapes': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '280px',
    },
    itemA: {
      width: '220px',
      minHeight: '160px',
      clipPath: 'none',
      background:
        'linear-gradient(145deg, rgba(59, 130, 246, 0.96), rgba(56, 189, 248, 0.92))',
      color: '#f8fafc',
    },
  },
  'clip-path-polygon': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '280px',
    },
    itemA: {
      width: '240px',
      minHeight: '160px',
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      background:
        'linear-gradient(145deg, rgba(249, 115, 22, 0.95), rgba(239, 68, 68, 0.9))',
      color: '#fff7ed',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'clip-shape-none': { itemA: { clipPath: 'none' } },
  'clip-shape-circle': { itemA: { clipPath: 'circle(40%)' } },
  'clip-shape-ellipse': { itemA: { clipPath: 'ellipse(45% 35%)' } },
  'clip-polygon-rect': {
    itemA: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
  },
  'clip-polygon-hex': {
    itemA: { clipPath: 'polygon(24% 0, 76% 0, 100% 50%, 76% 100%, 24% 100%, 0 50%)' },
  },
  'clip-polygon-ticket': {
    itemA: {
      clipPath: 'polygon(0 0, 84% 0, 100% 18%, 100% 82%, 84% 100%, 0 100%, 8% 50%)',
    },
  },
};

export const clipPathPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
