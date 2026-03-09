import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'overflow-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      display: 'block',
      width: '180px',
      minHeight: '64px',
      maxHeight: '64px',
      overflow: 'visible',
      padding: '8px 10px',
      textAlign: 'left',
      lineHeight: '1.2',
      whiteSpace: 'nowrap',
      fontWeight: 500,
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'overflow-visible': { itemA: { overflow: 'visible' } },
  'overflow-hidden': { itemA: { overflow: 'hidden' } },
  'overflow-scroll': { itemA: { overflow: 'scroll' } },
  'overflow-auto': { itemA: { overflow: 'auto' } },
};

export const overflowPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
