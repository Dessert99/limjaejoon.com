import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'unit-rem-box-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '8rem',
      height: '5rem',
    },
  },
  'unit-rem-text-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '320px',
      minHeight: '120px',
      padding: '16px',
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  'unit-rem-reference': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
    },
    itemA: {
      width: '128px',
      minHeight: '80px',
      fontSize: '16px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'rem-box-6': { itemA: { width: '6rem' } },
  'rem-box-8': { itemA: { width: '8rem' } },
  'rem-box-11': { itemA: { width: '11rem' } },
  'rem-text-0875': { itemA: { fontSize: '0.875rem' } },
  'rem-text-1': { itemA: { fontSize: '1rem' } },
  'rem-text-15': { itemA: { fontSize: '1.5rem' } },
  'rem-root-font-14': { itemA: { width: '112px', fontSize: '14px' } },
  'rem-root-font-16': { itemA: { width: '128px', fontSize: '16px' } },
  'rem-root-font-24': { itemA: { width: '192px', fontSize: '24px' } },
};

export const unitRemPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
