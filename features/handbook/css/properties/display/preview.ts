import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'display-block-basics': {
    container: {
      display: 'block',
      width: '100%',
      maxWidth: '420px',
      marginInline: 'auto',
      border: '1px dashed #64748b',
      borderRadius: '8px',
      padding: '10px',
      backgroundColor: '#0f172a',
    },
    allItems: {
      display: 'block',
      width: '220px',
      minHeight: '56px',
      marginTop: '16px',
      marginBottom: '16px',
      marginRight: '0px',
    },
  },
  'display-inline-basics': {
    container: {
      display: 'block',
      width: '100%',
      maxWidth: '420px',
      marginInline: 'auto',
      border: '1px dashed #64748b',
      borderRadius: '8px',
      padding: '10px',
      backgroundColor: '#0f172a',
      lineHeight: '1.9',
    },
    allItems: {
      display: 'inline',
      width: '220px',
      height: '56px',
      marginRight: '10px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'block-width-120': { allItems: { width: '120px' } },
  'block-width-220': { allItems: { width: '220px' } },
  'block-margin-y-0': {
    allItems: {
      marginTop: '0px',
      marginBottom: '0px',
    },
  },
  'block-margin-y-16': {
    allItems: {
      marginTop: '16px',
      marginBottom: '16px',
    },
  },
  'inline-width-120': { allItems: { width: '120px' } },
  'inline-width-220': { allItems: { width: '220px' } },
  'inline-height-56': { allItems: { height: '56px' } },
  'inline-height-120': { allItems: { height: '120px' } },
};

export const displayPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
