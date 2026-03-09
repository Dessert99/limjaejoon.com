import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'display-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      display: 'block',
      width: '240px',
      minHeight: '96px',
      textAlign: 'left',
      padding: '14px',
      lineHeight: '1.5',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'display-block': {
    itemA: { display: 'block', width: '240px', minHeight: '96px', padding: '14px' },
  },
  'display-inline': {
    itemA: { display: 'inline', width: 'auto', minHeight: 'auto', padding: '0px' },
  },
  'display-inline-block': {
    itemA: {
      display: 'inline-block',
      width: '240px',
      minHeight: '96px',
      padding: '14px',
    },
  },
  'display-flex': {
    itemA: {
      display: 'flex',
      width: '240px',
      minHeight: '96px',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0px',
      textAlign: 'center',
    },
  },
};

export const displayPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
