import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'z-index-basic': {
    container: {
      position: 'relative',
      display: 'block',
      width: '100%',
      minHeight: '280px',
    },
    itemA: {
      position: 'absolute',
      top: '36px',
      left: '36px',
      width: '150px',
      minHeight: '110px',
      zIndex: 3,
      background: '#ef4444',
      color: '#f8fafc',
    },
    itemB: {
      position: 'absolute',
      top: '84px',
      left: '98px',
      width: '150px',
      minHeight: '110px',
      zIndex: 2,
      background: '#3b82f6',
      color: '#f8fafc',
    },
    itemC: {
      position: 'absolute',
      top: '132px',
      left: '160px',
      width: '150px',
      minHeight: '110px',
      zIndex: 1,
      background: '#22c55e',
      color: '#f8fafc',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'z-index-a-1': { itemA: { zIndex: 1 } },
  'z-index-a-3': { itemA: { zIndex: 3 } },
  'z-index-a-8': { itemA: { zIndex: 8 } },
  'z-index-b-1': { itemB: { zIndex: 1 } },
  'z-index-b-2': { itemB: { zIndex: 2 } },
  'z-index-b-6': { itemB: { zIndex: 6 } },
};

export const zIndexPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
