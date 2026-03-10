import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'line-height-basic': {
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
      color: '#e2e8f0',
      fontSize: '18px',
      lineHeight: '1.6',
      padding: '16px',
      whiteSpace: 'normal',
      fontWeight: 500,
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'line-height-14': { itemA: { lineHeight: '1.4' } },
  'line-height-16': { itemA: { lineHeight: '1.6' } },
  'line-height-20': { itemA: { lineHeight: '2.0' } },
};

export const lineHeightPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
