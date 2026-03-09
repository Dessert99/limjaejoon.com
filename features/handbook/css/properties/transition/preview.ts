import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'transition-transform': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
    },
    itemA: {
      width: '210px',
      minHeight: '90px',
      transition: 'transform 300ms ease',
      transform: 'translateX(0px) scale(1)',
      background: '#2563eb',
      color: '#f8fafc',
    },
  },
  'transition-color-easing': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
    },
    itemA: {
      width: '240px',
      minHeight: '100px',
      transition: 'background-color 350ms ease',
      backgroundColor: '#1f2937',
      color: '#f8fafc',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'transition-duration-150': { itemA: { transition: 'transform 150ms ease' } },
  'transition-duration-300': { itemA: { transition: 'transform 300ms ease' } },
  'transition-duration-700': { itemA: { transition: 'transform 700ms ease' } },
  'transition-state-rest': { itemA: { transform: 'translateX(0px) scale(1)' } },
  'transition-state-active': {
    itemA: { transform: 'translateX(28px) scale(1.18)' },
  },
  'easing-ease': { itemA: { transition: 'background-color 350ms ease' } },
  'easing-linear': { itemA: { transition: 'background-color 350ms linear' } },
  'easing-ease-out': { itemA: { transition: 'background-color 350ms ease-out' } },
  'color-dark': { itemA: { backgroundColor: '#1f2937' } },
  'color-blue': { itemA: { backgroundColor: '#2563eb' } },
  'color-green': { itemA: { backgroundColor: '#16a34a' } },
};

export const transitionPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
