import type { CSSProperties } from 'react';

import { composeBoxShadow } from '@/features/handbook/css/properties/border/compose';
import type {
  CssPreviewConfig,
  HandbookSnippet,
  PreviewStylePatch,
  ResolvedPreviewStyles,
} from '@/features/handbook/css/common/types';

const SHADOW_DIRECTION_CONTROL_ID = 'shadow-direction';
const SHADOW_BLUR_CONTROL_ID = 'shadow-blur';
const SHADOW_COLOR_CONTROL_ID = 'shadow-color';

const emptyStyles = (): ResolvedPreviewStyles => {
  const container: CSSProperties = {};
  const itemA: CSSProperties = {};
  const itemB: CSSProperties = {};
  const itemC: CSSProperties = {};

  return {
    container,
    itemA,
    itemB,
    itemC,
  };
};

const mergeStyle = (
  prev: CSSProperties,
  next: CSSProperties | undefined
): CSSProperties => {
  const safeNext = next ?? {};

  return {
    ...prev,
    ...safeNext,
  };
};

const applyPatch = (
  styles: ResolvedPreviewStyles,
  patch?: PreviewStylePatch
) => {
  if (!patch) {
    return styles;
  }

  const container = mergeStyle(styles.container, patch.container);
  const itemA = mergeStyle(mergeStyle(styles.itemA, patch.allItems), patch.itemA);
  const itemB = mergeStyle(mergeStyle(styles.itemB, patch.allItems), patch.itemB);
  const itemC = mergeStyle(mergeStyle(styles.itemC, patch.allItems), patch.itemC);

  return {
    container,
    itemA,
    itemB,
    itemC,
  };
};

const resolveActiveTokens = (
  snippet: HandbookSnippet,
  selectedTokens: Record<string, string>
): Record<string, string> => {
  return snippet.controls.reduce<Record<string, string>>((acc, control) => {
    acc[control.id] = selectedTokens[control.id] ?? control.defaultStyleToken;
    return acc;
  }, {});
};

// 최종 미리보기 스타일 계산 함수:
// 1) snippet preset 기본 스타일 적용
// 2) 선택된 token 패치 순차 적용
export const computePreviewStyles = (
  snippet: HandbookSnippet,
  selectedTokens: Record<string, string>,
  previewConfig: CssPreviewConfig
): ResolvedPreviewStyles => {
  const activeTokens = resolveActiveTokens(snippet, selectedTokens);
  let styles = emptyStyles();

  styles = applyPatch(styles, previewConfig.presetStyleMap[snippet.previewPreset.presetKey]);

  for (const control of snippet.controls) {
    const activeToken = activeTokens[control.id];
    styles = applyPatch(styles, previewConfig.tokenStyleMap[activeToken]);
  }

  const shadowDirectionToken = activeTokens[SHADOW_DIRECTION_CONTROL_ID];
  const shadowBlurToken = activeTokens[SHADOW_BLUR_CONTROL_ID];
  const shadowColorToken = activeTokens[SHADOW_COLOR_CONTROL_ID];

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
