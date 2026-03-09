import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'height-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '200px',
      height: '140px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'height-80': { itemA: { height: '80px' } },
  'height-140': { itemA: { height: '140px' } },
  'height-200': { itemA: { height: '200px' } },
};

export const heightPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
