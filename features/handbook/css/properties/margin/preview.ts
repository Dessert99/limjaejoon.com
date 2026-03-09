import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'spacing-margin': {
    container: {
      display: 'flex',
      gap: '0px',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemA: {
      margin: '0px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'margin-0': { itemA: { margin: '0px' } },
  'margin-12': { itemA: { margin: '12px' } },
  'margin-24': { itemA: { margin: '24px' } },
};

export const marginPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
