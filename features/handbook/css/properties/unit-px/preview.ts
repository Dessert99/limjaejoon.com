import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'unit-px-box-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '160px',
      height: '96px',
    },
  },
  'unit-px-text-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '320px',
      minHeight: '120px',
      padding: '16px',
      fontSize: '18px',
      lineHeight: 1.5,
    },
  },
  'unit-px-reference': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      inlineSize: '300px',
      minHeight: '200px',
      marginInline: 'auto',
    },
    itemA: {
      width: '160px',
      minHeight: '80px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'px-box-120': { itemA: { width: '120px' } },
  'px-box-160': { itemA: { width: '160px' } },
  'px-box-220': { itemA: { width: '220px' } },
  'px-text-14': { itemA: { fontSize: '14px' } },
  'px-text-18': { itemA: { fontSize: '18px' } },
  'px-text-24': { itemA: { fontSize: '24px' } },
  'px-parent-220': { container: { inlineSize: '220px' } },
  'px-parent-300': { container: { inlineSize: '300px' } },
  'px-parent-380': { container: { inlineSize: '380px' } },
};

export const unitPxPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
