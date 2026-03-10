import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'text-align-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '320px',
      minHeight: '140px',
      display: 'block',
      textAlign: 'left',
      color: '#f8fafc',
      padding: '16px',
      lineHeight: '1.6',
      fontWeight: 500,
      whiteSpace: 'normal',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'text-align-left': { itemA: { textAlign: 'left' } },
  'text-align-center': { itemA: { textAlign: 'center' } },
  'text-align-right': { itemA: { textAlign: 'right' } },
};

export const textAlignPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
