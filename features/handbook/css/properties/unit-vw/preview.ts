import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'unit-vw-box-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '18vw',
      height: '96px',
    },
  },
  'unit-vw-text-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '320px',
      minHeight: '120px',
      padding: '16px',
      fontSize: '2vw',
      lineHeight: 1.5,
    },
  },
  'unit-vw-reference': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      inlineSize: '320px',
      minHeight: '200px',
      marginInline: 'auto',
    },
    itemA: {
      width: '22vw',
      minHeight: '80px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'vw-box-12': { itemA: { width: '12vw' } },
  'vw-box-18': { itemA: { width: '18vw' } },
  'vw-box-24': { itemA: { width: '24vw' } },
  'vw-text-14': { itemA: { fontSize: '1.4vw' } },
  'vw-text-2': { itemA: { fontSize: '2vw' } },
  'vw-text-28': { itemA: { fontSize: '2.8vw' } },
  'vw-parent-220': { container: { inlineSize: '220px' } },
  'vw-parent-320': { container: { inlineSize: '320px' } },
  'vw-parent-420': { container: { inlineSize: '420px' } },
};

export const unitVwPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
