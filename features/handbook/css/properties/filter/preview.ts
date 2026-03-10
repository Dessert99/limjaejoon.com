import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const baseContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '260px',
};

const baseItem = {
  width: '220px',
  minHeight: '120px',
  background:
    'linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(79, 70, 229, 0.95) 40%, rgba(244, 63, 94, 0.9))',
  color: '#f8fafc',
};

const presetStyleMap: PreviewPresetStyleMap = {
  'filter-blur': {
    container: baseContainer,
    itemA: {
      ...baseItem,
      filter: 'blur(0px)',
    },
  },
  'filter-brightness': {
    container: baseContainer,
    itemA: {
      ...baseItem,
      filter: 'brightness(100%)',
    },
  },
  'filter-contrast': {
    container: baseContainer,
    itemA: {
      ...baseItem,
      filter: 'contrast(110%)',
    },
  },
  'filter-grayscale': {
    container: baseContainer,
    itemA: {
      ...baseItem,
      filter: 'grayscale(0%)',
    },
  },
  'filter-saturate': {
    container: baseContainer,
    itemA: {
      ...baseItem,
      filter: 'saturate(100%)',
    },
  },
  'filter-sepia': {
    container: baseContainer,
    itemA: {
      ...baseItem,
      filter: 'sepia(0%)',
    },
  },
  'filter-invert': {
    container: baseContainer,
    itemA: {
      ...baseItem,
      filter: 'invert(0%)',
    },
  },
  'filter-hue-rotate': {
    container: baseContainer,
    itemA: {
      ...baseItem,
      filter: 'hue-rotate(0deg)',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'filter-blur-0': { itemA: { filter: 'blur(0px)' } },
  'filter-blur-2': { itemA: { filter: 'blur(2px)' } },
  'filter-blur-6': { itemA: { filter: 'blur(6px)' } },

  'filter-brightness-80': { itemA: { filter: 'brightness(80%)' } },
  'filter-brightness-100': { itemA: { filter: 'brightness(100%)' } },
  'filter-brightness-130': { itemA: { filter: 'brightness(130%)' } },

  'filter-contrast-90': { itemA: { filter: 'contrast(90%)' } },
  'filter-contrast-110': { itemA: { filter: 'contrast(110%)' } },
  'filter-contrast-140': { itemA: { filter: 'contrast(140%)' } },

  'filter-grayscale-0': { itemA: { filter: 'grayscale(0%)' } },
  'filter-grayscale-50': { itemA: { filter: 'grayscale(50%)' } },
  'filter-grayscale-100': { itemA: { filter: 'grayscale(100%)' } },

  'filter-saturate-80': { itemA: { filter: 'saturate(80%)' } },
  'filter-saturate-100': { itemA: { filter: 'saturate(100%)' } },
  'filter-saturate-140': { itemA: { filter: 'saturate(140%)' } },

  'filter-sepia-0': { itemA: { filter: 'sepia(0%)' } },
  'filter-sepia-40': { itemA: { filter: 'sepia(40%)' } },
  'filter-sepia-100': { itemA: { filter: 'sepia(100%)' } },

  'filter-invert-0': { itemA: { filter: 'invert(0%)' } },
  'filter-invert-40': { itemA: { filter: 'invert(40%)' } },
  'filter-invert-100': { itemA: { filter: 'invert(100%)' } },

  'filter-hue-rotate-0': { itemA: { filter: 'hue-rotate(0deg)' } },
  'filter-hue-rotate-90': { itemA: { filter: 'hue-rotate(90deg)' } },
  'filter-hue-rotate-180': { itemA: { filter: 'hue-rotate(180deg)' } },
};

export const filterPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
