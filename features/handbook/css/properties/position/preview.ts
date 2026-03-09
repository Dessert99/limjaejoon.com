import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'position-flow': {
    container: {
      position: 'relative',
      display: 'block',
      width: '100%',
      minHeight: '260px',
    },
    itemA: {
      position: 'static',
      top: 'auto',
      left: 'auto',
      width: '220px',
      minHeight: '76px',
      background: '#2563eb',
      color: '#f8fafc',
      zIndex: 2,
    },
    itemB: {
      position: 'static',
      width: '220px',
      minHeight: '76px',
      marginTop: '10px',
      background: '#374151',
      color: '#f8fafc',
    },
  },
  'position-absolute': {
    container: {
      position: 'relative',
      display: 'block',
      width: '100%',
      minHeight: '280px',
    },
    itemA: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      width: '160px',
      minHeight: '92px',
      background: '#dc2626',
      color: '#f8fafc',
      zIndex: 3,
    },
    itemB: {
      position: 'absolute',
      top: '92px',
      left: '116px',
      width: '180px',
      minHeight: '112px',
      background: '#16a34a',
      color: '#f8fafc',
      zIndex: 2,
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'position-flow-static': { itemA: { position: 'static' } },
  'position-flow-relative': { itemA: { position: 'relative' } },
  'position-flow-top-auto': { itemA: { top: 'auto' } },
  'position-flow-top-20': { itemA: { top: '20px' } },
  'position-flow-top-48': { itemA: { top: '48px' } },
  'position-flow-left-auto': { itemA: { left: 'auto' } },
  'position-flow-left-20': { itemA: { left: '20px' } },
  'position-flow-left-48': { itemA: { left: '48px' } },
  'position-abs-absolute': { itemA: { position: 'absolute' } },
  'position-abs-relative': { itemA: { position: 'relative' } },
  'position-abs-top-20': { itemA: { top: '20px' } },
  'position-abs-top-80': { itemA: { top: '80px' } },
  'position-abs-top-140': { itemA: { top: '140px' } },
  'position-abs-left-20': { itemA: { left: '20px' } },
  'position-abs-left-100': { itemA: { left: '100px' } },
  'position-abs-left-180': { itemA: { left: '180px' } },
  'position-abs-z-1': { itemA: { zIndex: 1 } },
  'position-abs-z-3': { itemA: { zIndex: 3 } },
  'position-abs-z-8': { itemA: { zIndex: 8 } },
};

export const positionPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
