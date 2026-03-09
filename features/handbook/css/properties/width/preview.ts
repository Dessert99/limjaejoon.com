import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'width-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '200px',
      minHeight: '80px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'width-120': { itemA: { width: '120px' } },
  'width-200': { itemA: { width: '200px' } },
  'width-280': { itemA: { width: '280px' } },
};

export const widthPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
