import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'spacing-padding': {
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemA: {
      width: 'fit-content',
      minWidth: '0px',
      minHeight: '0px',
      height: 'auto',
      padding: '8px',
      border: '1px solid #374151',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
  'spacing-padding-sides': {
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemA: {
      width: 'fit-content',
      minWidth: '0px',
      minHeight: '0px',
      height: 'auto',
      paddingTop: '12px',
      paddingRight: '12px',
      paddingBottom: '12px',
      paddingLeft: '12px',
      border: '1px solid #374151',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'padding-8': { itemA: { padding: '8px' } },
  'padding-16': { itemA: { padding: '16px' } },
  'padding-24': { itemA: { padding: '24px' } },
  'padding-top-0': { itemA: { paddingTop: '0px' } },
  'padding-top-12': { itemA: { paddingTop: '12px' } },
  'padding-top-24': { itemA: { paddingTop: '24px' } },
  'padding-right-0': { itemA: { paddingRight: '0px' } },
  'padding-right-12': { itemA: { paddingRight: '12px' } },
  'padding-right-24': { itemA: { paddingRight: '24px' } },
  'padding-bottom-0': { itemA: { paddingBottom: '0px' } },
  'padding-bottom-12': { itemA: { paddingBottom: '12px' } },
  'padding-bottom-24': { itemA: { paddingBottom: '24px' } },
  'padding-left-0': { itemA: { paddingLeft: '0px' } },
  'padding-left-12': { itemA: { paddingLeft: '12px' } },
  'padding-left-24': { itemA: { paddingLeft: '24px' } },
};

export const paddingPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
