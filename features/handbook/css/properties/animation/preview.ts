import type { CSSProperties } from 'react';

import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'animation-shorthand-speed': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
    },
    itemA: {
      width: '210px',
      minHeight: '100px',
      color: '#f8fafc',
      background:
        'linear-gradient(140deg, rgba(14, 116, 144, 0.94), rgba(37, 99, 235, 0.92))',
      '--animation-name': 'handbook-orbit-shift',
      '--animation-duration': '1200ms',
      '--animation-timing': 'ease-in-out',
      '--animation-iteration': 'infinite',
      '--animation-direction': 'normal',
      '--animation-delay': '0ms',
      animation:
        'var(--animation-name) var(--animation-duration) var(--animation-timing) var(--animation-delay) var(--animation-iteration) var(--animation-direction)',
    } as CSSProperties,
  },
  'animation-shorthand-direction': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '260px',
    },
    itemA: {
      width: '220px',
      minHeight: '100px',
      color: '#e2e8f0',
      background:
        'linear-gradient(145deg, rgba(147, 51, 234, 0.88), rgba(29, 78, 216, 0.9))',
      '--animation-name': 'handbook-pulse-drift',
      '--animation-duration': '1400ms',
      '--animation-timing': 'ease-in-out',
      '--animation-iteration': 'infinite',
      '--animation-direction': 'alternate',
      '--animation-delay': '0ms',
      animation:
        'var(--animation-name) var(--animation-duration) var(--animation-timing) var(--animation-delay) var(--animation-iteration) var(--animation-direction)',
    } as CSSProperties,
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'animation-duration-600': {
    itemA: { '--animation-duration': '600ms' } as CSSProperties,
  },
  'animation-duration-1200': {
    itemA: { '--animation-duration': '1200ms' } as CSSProperties,
  },
  'animation-duration-2000': {
    itemA: { '--animation-duration': '2000ms' } as CSSProperties,
  },
  'animation-timing-ease-in-out': {
    itemA: { '--animation-timing': 'ease-in-out' } as CSSProperties,
  },
  'animation-timing-linear': {
    itemA: { '--animation-timing': 'linear' } as CSSProperties,
  },
  'animation-timing-overshoot': {
    itemA: {
      '--animation-timing': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    } as CSSProperties,
  },
  'animation-iteration-1': {
    itemA: { '--animation-iteration': '1' } as CSSProperties,
  },
  'animation-iteration-3': {
    itemA: { '--animation-iteration': '3' } as CSSProperties,
  },
  'animation-iteration-infinite': {
    itemA: { '--animation-iteration': 'infinite' } as CSSProperties,
  },
  'animation-direction-normal': {
    itemA: { '--animation-direction': 'normal' } as CSSProperties,
  },
  'animation-direction-alternate': {
    itemA: { '--animation-direction': 'alternate' } as CSSProperties,
  },
  'animation-direction-reverse': {
    itemA: { '--animation-direction': 'reverse' } as CSSProperties,
  },
  'animation-delay-0': {
    itemA: { '--animation-delay': '0ms' } as CSSProperties,
  },
  'animation-delay-300': {
    itemA: { '--animation-delay': '300ms' } as CSSProperties,
  },
  'animation-delay-700': {
    itemA: { '--animation-delay': '700ms' } as CSSProperties,
  },
};

export const animationPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
