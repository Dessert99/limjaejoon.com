import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'unit-em-box-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
    },
    itemA: {
      width: '10em',
      height: '6em',
    },
  },
  'unit-em-text-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
    },
    itemA: {
      width: '320px',
      minHeight: '120px',
      padding: '16px',
      fontSize: '1em',
      lineHeight: 1.5,
    },
  },
  'unit-em-reference': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      fontSize: '18px',
    },
    itemA: {
      width: '10em',
      minHeight: '80px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'em-box-8': { itemA: { width: '8em' } },
  'em-box-10': { itemA: { width: '10em' } },
  'em-box-14': { itemA: { width: '14em' } },
  'em-text-0875': { itemA: { fontSize: '0.875em' } },
  'em-text-1': { itemA: { fontSize: '1em' } },
  'em-text-14': { itemA: { fontSize: '1.4em' } },
  'em-parent-font-14': { container: { fontSize: '14px' } },
  'em-parent-font-18': { container: { fontSize: '18px' } },
  'em-parent-font-24': { container: { fontSize: '24px' } },
};

export const unitEmPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
