import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'flex-justify': {
    container: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'justify-start': { container: { justifyContent: 'flex-start' } },
  'justify-center': { container: { justifyContent: 'center' } },
  'justify-between': { container: { justifyContent: 'space-between' } },
};

export const justifyContentPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
