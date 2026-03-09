import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'text-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '240px',
      minHeight: '120px',
      textAlign: 'left',
      color: '#f8fafc',
      padding: '12px',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'text-align-left': { itemA: { textAlign: 'left' } },
  'text-align-center': { itemA: { textAlign: 'center' } },
  'text-align-right': { itemA: { textAlign: 'right' } },
  'text-color-default': { itemA: { color: '#f8fafc' } },
  'text-color-accent': { itemA: { color: '#facc15' } },
};

export const textPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
