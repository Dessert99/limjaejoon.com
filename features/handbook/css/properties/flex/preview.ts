import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const presetStyleMap: PreviewPresetStyleMap = {
  'flex-basic': {
    container: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
  },
  'flex-justify': {
    container: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  },
  'flex-align': {
    container: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-start',
      alignItems: 'center',
      minHeight: '240px',
    },
  },
  'flex-wrap': {
    container: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      maxWidth: '320px',
      minHeight: '300px',
    },
    itemA: { minWidth: '78px' },
    itemB: { minWidth: '78px' },
    itemC: { minWidth: '78px' },
  },
  'flex-grow': {
    container: {
      display: 'flex',
      gap: '10px',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      width: '100%',
    },
    itemA: { flexBasis: '90px', flexGrow: 1, flexShrink: 1 },
    itemB: { flexBasis: '90px', flexGrow: 1, flexShrink: 1 },
    itemC: { flexBasis: '90px', flexGrow: 0, flexShrink: 1 },
  },
  'flex-shrink': {
    container: {
      display: 'flex',
      gap: '8px',
      width: '300px',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    itemA: { flexBasis: '200px', flexGrow: 0, flexShrink: 1, minWidth: '0px' },
    itemB: { flexBasis: '120px', flexGrow: 0, flexShrink: 1, minWidth: '0px' },
    itemC: { flexBasis: '120px', flexGrow: 0, flexShrink: 1, minWidth: '0px' },
  },
  'flex-basis': {
    container: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    itemA: { flexGrow: 0, flexShrink: 0, flexBasis: '120px', width: '100px' },
    itemB: { flexGrow: 0, flexShrink: 0, flexBasis: '100px', width: '100px' },
    itemC: { flexGrow: 0, flexShrink: 0, flexBasis: '100px', width: '100px' },
  },
  'flex-order-self': {
    container: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      minHeight: '220px',
    },
    itemA: { order: 0, alignSelf: 'flex-start' },
    itemB: { order: 0 },
    itemC: { order: 0 },
  },
};

const tokenStyleMap: PreviewStyleTokenMap = {
  'flex-direction-row': { container: { flexDirection: 'row' } },
  'flex-direction-column': { container: { flexDirection: 'column' } },
  'justify-start': { container: { justifyContent: 'flex-start' } },
  'justify-center': { container: { justifyContent: 'center' } },
  'justify-between': { container: { justifyContent: 'space-between' } },
  'align-start': { container: { alignItems: 'flex-start' } },
  'align-center': { container: { alignItems: 'center' } },
  'align-end': { container: { alignItems: 'flex-end' } },
  'flex-nowrap': { container: { flexWrap: 'nowrap' } },
  'flex-wrap': { container: { flexWrap: 'wrap' } },
  'flex-gap-8': { container: { gap: '8px' } },
  'flex-gap-20': { container: { gap: '20px' } },
  'align-content-start': { container: { alignContent: 'flex-start' } },
  'align-content-center': { container: { alignContent: 'center' } },
  'align-content-between': { container: { alignContent: 'space-between' } },
  'flex-grow-0': { itemA: { flexGrow: 0 } },
  'flex-grow-1': { itemA: { flexGrow: 1 } },
  'flex-grow-2': { itemA: { flexGrow: 2 } },
  'flex-shrink-0': { itemA: { flexShrink: 0 } },
  'flex-shrink-1': { itemA: { flexShrink: 1 } },
  'flex-shrink-2': { itemA: { flexShrink: 2 } },
  'flex-basis-80': { itemA: { flexBasis: '80px' } },
  'flex-basis-120': { itemA: { flexBasis: '120px' } },
  'flex-basis-180': { itemA: { flexBasis: '180px' } },
  'flex-order--1': { itemA: { order: -1 } },
  'flex-order-0': { itemA: { order: 0 } },
  'flex-order-2': { itemA: { order: 2 } },
  'align-self-start': { itemA: { alignSelf: 'flex-start' } },
  'align-self-center': { itemA: { alignSelf: 'center' } },
  'align-self-end': { itemA: { alignSelf: 'flex-end' } },
  'align-self-stretch': { itemA: { alignSelf: 'stretch' } },
};

export const flexPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
