import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'unit-vh-box-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '180px',
      height: '20vh',
    },
  },
  'unit-vh-text-size': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '320px',
      minHeight: '120px',
      padding: '16px',
      fontSize: '2.8vh',
      lineHeight: 1.5,
    },
  },
  'unit-vh-reference': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
    },
    itemA: {
      height: '24vh',
      width: '200px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'vh-box-14': { itemA: { height: '14vh' } },
  'vh-box-20': { itemA: { height: '20vh' } },
  'vh-box-28': { itemA: { height: '28vh' } },
  'vh-text-2': { itemA: { fontSize: '2vh' } },
  'vh-text-28': { itemA: { fontSize: '2.8vh' } },
  'vh-text-36': { itemA: { fontSize: '3.6vh' } },
  'vh-parent-180': { container: { minHeight: '180px' } },
  'vh-parent-260': { container: { minHeight: '260px' } },
  'vh-parent-340': { container: { minHeight: '340px' } },
};

export const unitVhPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
