import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'unit-percent-box-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '320px',
      marginInline: 'auto',
    },
    itemA: {
      width: '60%',
      height: '96px',
    },
  },
  'unit-percent-text-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
    },
    itemA: {
      width: '320px',
      minHeight: '120px',
      padding: '16px',
      fontSize: '100%',
      lineHeight: 1.5,
    },
  },
  'unit-percent-reference': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '320px',
      minHeight: '200px',
      marginInline: 'auto',
    },
    itemA: {
      width: '50%',
      minHeight: '80px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'percent-box-40': { itemA: { width: '40%' } },
  'percent-box-60': { itemA: { width: '60%' } },
  'percent-box-80': { itemA: { width: '80%' } },
  'percent-text-80': { itemA: { fontSize: '80%' } },
  'percent-text-100': { itemA: { fontSize: '100%' } },
  'percent-text-140': { itemA: { fontSize: '140%' } },
  'percent-parent-240': { container: { width: '240px' } },
  'percent-parent-320': { container: { width: '320px' } },
  'percent-parent-400': { container: { width: '400px' } },
};

export const unitPercentPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
