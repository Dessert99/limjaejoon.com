import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'font-basic': {
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
      fontSize: '18px',
      fontWeight: 600,
      fontStyle: 'normal',
      whiteSpace: 'normal',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'font-size-14': { itemA: { fontSize: '14px' } },
  'font-size-18': { itemA: { fontSize: '18px' } },
  'font-size-24': { itemA: { fontSize: '24px' } },
  'font-weight-400': { itemA: { fontWeight: 400 } },
  'font-weight-600': { itemA: { fontWeight: 600 } },
  'font-weight-800': { itemA: { fontWeight: 800 } },
  'font-style-normal': { itemA: { fontStyle: 'normal' } },
  'font-style-italic': { itemA: { fontStyle: 'italic' } },
};

export const fontPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
