import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'spacing-margin': {
    container: {
      display: 'flex',
      gap: '0px',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemB: {
      margin: '0px',
    },
  },
  'spacing-margin-sides': {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0px',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemA: {
      width: '28%',
    },
    itemB: {
      width: '28%',
      marginTop: '12px',
      marginRight: '12px',
      marginBottom: '12px',
      marginLeft: '12px',
    },
    itemC: {
      width: '28%',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'margin-0': { itemB: { margin: '0px' } },
  'margin-12': { itemB: { margin: '12px' } },
  'margin-24': { itemB: { margin: '24px' } },
  'margin-top-0': { itemB: { marginTop: '0px' } },
  'margin-top-12': { itemB: { marginTop: '12px' } },
  'margin-top-24': { itemB: { marginTop: '24px' } },
  'margin-right-0': { itemB: { marginRight: '0px' } },
  'margin-right-12': { itemB: { marginRight: '12px' } },
  'margin-right-24': { itemB: { marginRight: '24px' } },
  'margin-bottom-0': { itemB: { marginBottom: '0px' } },
  'margin-bottom-12': { itemB: { marginBottom: '12px' } },
  'margin-bottom-24': { itemB: { marginBottom: '24px' } },
  'margin-left-0': { itemB: { marginLeft: '0px' } },
  'margin-left-12': { itemB: { marginLeft: '12px' } },
  'margin-left-24': { itemB: { marginLeft: '24px' } },
};

export const marginPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
