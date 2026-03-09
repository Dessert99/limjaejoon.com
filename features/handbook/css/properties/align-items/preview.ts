import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'flex-align': {
    container: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-start',
      alignItems: 'center',
      minHeight: '240px',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'align-start': { container: { alignItems: 'flex-start' } },
  'align-center': { container: { alignItems: 'center' } },
  'align-end': { container: { alignItems: 'flex-end' } },
};

export const alignItemsPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
