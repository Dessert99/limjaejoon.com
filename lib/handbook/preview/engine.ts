import type { CSSProperties } from 'react';

import type {
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
  ResolvedPreviewStyles,
} from '@/lib/handbook/preview/types';
import { composeBoxShadow } from '@/lib/handbook/shadow/compose';
import type { HandbookSnippet, PreviewTarget } from '@/lib/handbook/types';

// 계산 시작 시 사용할 빈 스타일 객체입니다.
const emptyStyles = (): ResolvedPreviewStyles => ({
  container: {},
  itemA: {},
  itemB: {},
  itemC: {},
});

// 이전 스타일에 다음 스타일을 덮어씌우는 병합 함수입니다.
const mergeStyle = (
  prev: CSSProperties,
  next: CSSProperties | undefined
): CSSProperties => ({
  ...prev,
  ...(next ?? {}),
});

// 패치 1개를 container/item 스타일에 적용합니다.
const applyPatch = (
  styles: ResolvedPreviewStyles,
  patch?: Partial<Record<PreviewTarget, CSSProperties>>
) => {
  if (!patch) {
    return styles;
  }

  return {
    container: mergeStyle(styles.container, patch.container),
    itemA: mergeStyle(styles.itemA, patch.itemA),
    itemB: mergeStyle(styles.itemB, patch.itemB),
    itemC: mergeStyle(styles.itemC, patch.itemC),
  };
};

// 특정 control의 현재 활성 styleToken을 찾습니다.
const getActiveToken = (
  snippet: HandbookSnippet,
  selectedTokens: Record<string, string>,
  controlId: string
): string | undefined => {
  const control = snippet.controls.find((item) => item.id === controlId);

  if (!control) {
    return undefined;
  }

  return selectedTokens[control.id] ?? control.defaultStyleToken;
};

// 스니펫별 기본 미리보기 스타일 프리셋입니다.
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
      // gap이 커져도 3열이 유지되도록 폭을 조금 넓혀 align-content 변화를 보이게 합니다.
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
  'grid-columns': {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '12px',
    },
  },
  'grid-gap': {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '8px',
    },
  },
  'grid-span': {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '10px',
    },
    itemA: {
      gridColumn: 'span 1',
    },
  },
  'grid-autofit': {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '10px',
    },
  },
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
  'box-sizing': {
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap',
    },
    itemA: {
      width: '180px',
      minHeight: '92px',
      padding: '20px',
      borderWidth: '6px',
      borderStyle: 'solid',
      borderColor: '#60a5fa',
      boxSizing: 'content-box',
    },
    itemB: {
      width: '180px',
      minHeight: '92px',
      padding: '20px',
      borderWidth: '6px',
      borderStyle: 'solid',
      borderColor: '#60a5fa',
      boxSizing: 'border-box',
    },
  },
  'spacing-margin': {
    container: {
      display: 'flex',
      gap: '0px',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemA: {
      margin: '0px',
    },
  },
  'spacing-padding': {
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemA: {
      width: 'fit-content',
      minWidth: '0px',
      minHeight: '0px',
      height: 'auto',
      padding: '8px',
      border: '1px solid #374151',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
  'spacing-axis': {
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    itemA: {
      width: '140px',
      minWidth: '140px',
      minHeight: '72px',
      marginInline: '8px',
      marginBlock: '6px',
    },
  },
  'spacing-gap-vs-margin': {
    container: {
      display: 'flex',
      gap: '12px',
    },
    itemA: { marginRight: '0px' },
    itemB: { marginRight: '0px' },
    itemC: { marginRight: '0px' },
  },
};

// 버튼 클릭으로 바뀌는 styleToken별 스타일 패치입니다.
const previewStyleTokenMap: PreviewStyleTokenMap = {
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

  'grid-cols-2': {
    container: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
  'grid-cols-3': {
    container: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  },
  'grid-cols-4': {
    container: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  },
  'grid-gap-8': { container: { gap: '8px' } },
  'grid-gap-20': { container: { gap: '20px' } },
  'grid-span-1': { itemA: { gridColumn: 'span 1' } },
  'grid-span-2': { itemA: { gridColumn: 'span 2' } },
  'grid-span-3': { itemA: { gridColumn: 'span 3' } },
  'autofit-100': {
    container: { gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' },
  },
  'autofit-140': {
    container: { gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' },
  },
  'autofit-180': {
    container: { gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' },
  },

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
  'shadow-dir-vertical': {
    itemA: {
      boxShadow:
        '0 -8px 18px rgba(255, 255, 255, 0.28), 0 8px 18px rgba(255, 255, 255, 0.28)',
    },
  },
  'shadow-dir-horizontal': {
    itemA: {
      boxShadow:
        '-8px 0 18px rgba(255, 255, 255, 0.28), 8px 0 18px rgba(255, 255, 255, 0.28)',
    },
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
  'box-width-140': { itemA: { width: '140px' }, itemB: { width: '140px' } },
  'box-width-180': { itemA: { width: '180px' }, itemB: { width: '180px' } },
  'box-width-220': { itemA: { width: '220px' }, itemB: { width: '220px' } },
  'box-padding-8': { itemA: { padding: '8px' }, itemB: { padding: '8px' } },
  'box-padding-20': { itemA: { padding: '20px' }, itemB: { padding: '20px' } },
  'box-padding-32': { itemA: { padding: '32px' }, itemB: { padding: '32px' } },
  'box-border-width-2': {
    itemA: { borderWidth: '2px' },
    itemB: { borderWidth: '2px' },
  },
  'box-border-width-6': {
    itemA: { borderWidth: '6px' },
    itemB: { borderWidth: '6px' },
  },
  'box-border-width-10': {
    itemA: { borderWidth: '10px' },
    itemB: { borderWidth: '10px' },
  },

  'margin-0': { itemA: { margin: '0px' } },
  'margin-12': { itemA: { margin: '12px' } },
  'margin-24': { itemA: { margin: '24px' } },
  'padding-8': { itemA: { padding: '8px' } },
  'padding-16': { itemA: { padding: '16px' } },
  'padding-24': { itemA: { padding: '24px' } },
  'axis-compact': { itemA: { marginInline: '8px', marginBlock: '6px' } },
  'axis-balanced': { itemA: { marginInline: '16px', marginBlock: '16px' } },
  'axis-wide': { itemA: { marginInline: '24px', marginBlock: '8px' } },
  'spacing-gap-mode': {
    container: { gap: '12px' },
    itemA: { marginRight: '0px' },
    itemB: { marginRight: '0px' },
    itemC: { marginRight: '0px' },
  },
  'spacing-margin-mode': {
    container: { gap: '0px' },
    itemA: { marginRight: '12px' },
    itemB: { marginRight: '12px' },
    itemC: { marginRight: '0px' },
  },
};

// 최종 미리보기 스타일 계산 함수:
// 1) preset 기본 스타일 적용
// 2) 선택된 토큰 패치를 순서대로 덧씌움
export const computePreviewStyles = (
  snippet: HandbookSnippet,
  selectedTokens: Record<string, string>
): ResolvedPreviewStyles => {
  let styles = emptyStyles();
  styles = applyPatch(styles, presetStyleMap[snippet.previewPreset.presetKey]);

  for (const control of snippet.controls) {
    const activeToken = selectedTokens[control.id] ?? control.defaultStyleToken;
    styles = applyPatch(styles, previewStyleTokenMap[activeToken]);
  }

  // box-shadow 상세 조합(방향/blur/색상) 컨트롤이 있으면 최종 값을 재계산합니다.
  const shadowDirectionToken = getActiveToken(
    snippet,
    selectedTokens,
    'shadow-direction'
  );
  const shadowBlurToken = getActiveToken(
    snippet,
    selectedTokens,
    'shadow-blur'
  );
  const shadowColorToken = getActiveToken(
    snippet,
    selectedTokens,
    'shadow-color'
  );

  if (shadowDirectionToken && shadowBlurToken && shadowColorToken) {
    styles = {
      ...styles,
      itemA: {
        ...styles.itemA,
        boxShadow: composeBoxShadow(
          shadowDirectionToken,
          shadowBlurToken,
          shadowColorToken
        ),
      },
    };
  }

  return styles;
};
