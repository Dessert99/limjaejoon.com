import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const flexContainerHighlight = {
  backgroundColor: 'rgba(251, 146, 60, 0.16)',
  border: '1px dashed #fdba74',
};

const presetStyleMap: PreviewPresetStyleMap = {
  'flex-basic': {
    container: {
      ...flexContainerHighlight,
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
  },
  'flex-justify': {
    container: {
      ...flexContainerHighlight,
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
  },
  'flex-align': {
    container: {
      ...flexContainerHighlight,
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      minHeight: '240px',
    },
  },
  'flex-wrap': {
    container: {
      ...flexContainerHighlight,
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
  'flex-order-self': {
    container: {
      ...flexContainerHighlight,
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
