import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'color-basic': {
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
      fontSize: '20px',
      fontWeight: 600,
      whiteSpace: 'normal',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'color-white': { itemA: { color: '#f8fafc' } },
  'color-blue': { itemA: { color: '#60a5fa' } },
  'color-red': { itemA: { color: '#f87171' } },
};

export const colorPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
