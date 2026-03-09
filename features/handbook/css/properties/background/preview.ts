import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'background-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '240px',
      minHeight: '120px',
      background: '#1f2937',
      border: '1px solid #4b5563',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'background-dark': { itemA: { background: '#1f2937' } },
  'background-amber': { itemA: { background: '#78350f' } },
  'background-gradient': {
    itemA: {
      background: 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)',
    },
  },
};

export const backgroundPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
