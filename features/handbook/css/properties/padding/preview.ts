import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'spacing-padding': {
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemA: {
      width: 'fit-content',
      minWidth: '0px',
      minHeight: '0px',
      height: 'auto',
      padding: '8px',
      border: '1px solid #374151',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'padding-8': { itemA: { padding: '8px' } },
  'padding-16': { itemA: { padding: '16px' } },
  'padding-24': { itemA: { padding: '24px' } },
};

export const paddingPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
