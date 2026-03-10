import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'box-border-style': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '220px',
      minHeight: '110px',
      borderWidth: '1px',
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
    },
  },
  'box-radius': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '220px',
      minHeight: '110px',
      borderWidth: '2px',
      borderColor: '#6b7280',
      borderStyle: 'solid',
      borderRadius: '0px',
    },
  },
  'box-radius-corners': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '220px',
      minHeight: '110px',
      borderWidth: '2px',
      borderColor: '#6b7280',
      borderStyle: 'solid',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
      borderBottomLeftRadius: '8px',
    },
  },
  'box-shadow': {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemA: {
      width: '220px',
      minHeight: '110px',
      boxShadow: 'none',
      border: '1px solid #374151',
    },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'border-width-0': { itemA: { borderWidth: '0px' } },
  'border-width-1': { itemA: { borderWidth: '1px' } },
  'border-width-5': { itemA: { borderWidth: '5px' } },
  'border-width-10': { itemA: { borderWidth: '10px' } },
  'border-style-none': { itemA: { borderStyle: 'none' } },
  'border-style-hidden': { itemA: { borderStyle: 'hidden' } },
  'border-style-dotted': { itemA: { borderStyle: 'dotted' } },
  'border-style-dashed': { itemA: { borderStyle: 'dashed' } },
  'border-style-solid': { itemA: { borderStyle: 'solid' } },
  'border-style-double': { itemA: { borderStyle: 'double' } },
  'border-style-groove': { itemA: { borderStyle: 'groove' } },
  'border-style-ridge': { itemA: { borderStyle: 'ridge' } },
  'border-style-inset': { itemA: { borderStyle: 'inset' } },
  'border-style-outset': { itemA: { borderStyle: 'outset' } },
  'radius-0': { itemA: { borderRadius: '0px' } },
  'radius-16': { itemA: { borderRadius: '16px' } },
  'radius-pill': { itemA: { borderRadius: '9999px' } },
  'radius-tl-0': { itemA: { borderTopLeftRadius: '0px' } },
  'radius-tl-8': { itemA: { borderTopLeftRadius: '8px' } },
  'radius-tl-16': { itemA: { borderTopLeftRadius: '16px' } },
  'radius-tr-0': { itemA: { borderTopRightRadius: '0px' } },
  'radius-tr-8': { itemA: { borderTopRightRadius: '8px' } },
  'radius-tr-16': { itemA: { borderTopRightRadius: '16px' } },
  'radius-br-0': { itemA: { borderBottomRightRadius: '0px' } },
  'radius-br-8': { itemA: { borderBottomRightRadius: '8px' } },
  'radius-br-16': { itemA: { borderBottomRightRadius: '16px' } },
  'radius-bl-0': { itemA: { borderBottomLeftRadius: '0px' } },
  'radius-bl-8': { itemA: { borderBottomLeftRadius: '8px' } },
  'radius-bl-16': { itemA: { borderBottomLeftRadius: '16px' } },
  'shadow-dir-none': { itemA: { boxShadow: 'none' } },
  'shadow-dir-top': {
    itemA: { boxShadow: '0 -8px 18px rgba(255, 255, 255, 0.28)' },
  },
  'shadow-dir-bottom': {
    itemA: { boxShadow: '0 8px 18px rgba(255, 255, 255, 0.28)' },
  },
  'shadow-dir-left': {
    itemA: { boxShadow: '-8px 0 18px rgba(255, 255, 255, 0.28)' },
  },
  'shadow-dir-right': {
    itemA: { boxShadow: '8px 0 18px rgba(255, 255, 255, 0.28)' },
  },
  'shadow-blur-8': {
    itemA: { boxShadow: '0 8px 8px rgba(255, 255, 255, 0.28)' },
  },
  'shadow-blur-18': {
    itemA: { boxShadow: '0 8px 18px rgba(255, 255, 255, 0.28)' },
  },
  'shadow-blur-28': {
    itemA: { boxShadow: '0 8px 28px rgba(255, 255, 255, 0.28)' },
  },
  'shadow-color-white': {
    itemA: { boxShadow: '0 8px 18px rgba(255, 255, 255, 0.28)' },
  },
  'shadow-color-yellow': {
    itemA: { boxShadow: '0 8px 18px rgba(250, 204, 21, 0.45)' },
  },
};

export const borderPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
