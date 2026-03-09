import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'text-basic': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '320px',
      minHeight: '140px',
      display: 'block',
      textAlign: 'left',
      color: '#f8fafc',
      padding: '16px',
      lineHeight: '1.6',
      fontWeight: 500,
      whiteSpace: 'normal',
    },
  },
  'text-size-color': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '320px',
      minHeight: '140px',
      padding: '16px',
      textAlign: 'left',
      fontSize: '18px',
      color: '#f8fafc',
      lineHeight: '1.6',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
  'text-weight-style': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '320px',
      minHeight: '140px',
      padding: '16px',
      textAlign: 'left',
      fontSize: '20px',
      color: '#e2e8f0',
      fontWeight: 600,
      fontStyle: 'normal',
      lineHeight: '1.55',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
  'text-line-spacing': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '320px',
      minHeight: '140px',
      display: 'block',
      padding: '16px',
      textAlign: 'left',
      color: '#e2e8f0',
      fontSize: '18px',
      lineHeight: '1.6',
      letterSpacing: '0.02em',
      whiteSpace: 'normal',
      fontWeight: 500,
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'text-align-left': { itemA: { textAlign: 'left' } },
  'text-align-center': { itemA: { textAlign: 'center' } },
  'text-align-right': { itemA: { textAlign: 'right' } },
  'text-color-white': { itemA: { color: '#f8fafc' } },
  'text-color-blue': { itemA: { color: '#60a5fa' } },
  'text-color-red': { itemA: { color: '#f87171' } },
  'font-size-14': { itemA: { fontSize: '14px' } },
  'font-size-18': { itemA: { fontSize: '18px' } },
  'font-size-24': { itemA: { fontSize: '24px' } },
  'font-weight-400': { itemA: { fontWeight: 400 } },
  'font-weight-600': { itemA: { fontWeight: 600 } },
  'font-weight-800': { itemA: { fontWeight: 800 } },
  'font-style-normal': { itemA: { fontStyle: 'normal' } },
  'font-style-italic': { itemA: { fontStyle: 'italic' } },
  'line-height-14': { itemA: { lineHeight: '1.4' } },
  'line-height-16': { itemA: { lineHeight: '1.6' } },
  'line-height-20': { itemA: { lineHeight: '2.0' } },
  'letter-spacing-000': { itemA: { letterSpacing: '0em' } },
  'letter-spacing-002': { itemA: { letterSpacing: '0.02em' } },
  'letter-spacing-008': { itemA: { letterSpacing: '0.08em' } },
};

export const textPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
