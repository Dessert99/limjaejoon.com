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
      background: 'black',
      border: '1px solid #4b5563',
      color: '#f8fafc',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'background-white': {
    itemA: { background: 'white', color: '#111827', borderColor: '#d1d5db' },
  },
  'background-black': {
    itemA: { background: 'black', color: '#f8fafc', borderColor: '#4b5563' },
  },
  'background-red': {
    itemA: { background: 'red', color: '#f8fafc', borderColor: '#7f1d1d' },
  },
  'background-blue': {
    itemA: { background: 'blue', color: '#f8fafc', borderColor: '#1e3a8a' },
  },
  'background-green': {
    itemA: { background: 'green', color: '#f8fafc', borderColor: '#166534' },
  },
};

export const backgroundPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
