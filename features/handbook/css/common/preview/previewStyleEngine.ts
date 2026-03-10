import type { CSSProperties } from 'react';

import { composeBoxShadow } from '@/features/handbook/css/properties/border/compose';
import {
  composeClipPathCircle,
  composeClipPathEllipse,
  composeClipPathPath,
  composeClipPathPolygon,
  composeClipPathRect,
  composeClipPathXywh,
} from '@/features/handbook/css/properties/clip-path/compose';
import type {
  CssPreviewConfig,
  HandbookSnippet,
  PreviewStylePatch,
  ResolvedPreviewStyles,
} from '@/features/handbook/css/common/types';

const SHADOW_DIRECTION_CONTROL_ID = 'shadow-direction';
const SHADOW_BLUR_CONTROL_ID = 'shadow-blur';
const SHADOW_COLOR_CONTROL_ID = 'shadow-color';
const CLIP_CIRCLE_RADIUS_CONTROL_ID = 'clip-circle-radius';
const CLIP_CIRCLE_CENTER_X_CONTROL_ID = 'clip-circle-center-x';
const CLIP_CIRCLE_CENTER_Y_CONTROL_ID = 'clip-circle-center-y';
const CLIP_ELLIPSE_RADIUS_X_CONTROL_ID = 'clip-ellipse-radius-x';
const CLIP_ELLIPSE_RADIUS_Y_CONTROL_ID = 'clip-ellipse-radius-y';
const CLIP_ELLIPSE_CENTER_X_CONTROL_ID = 'clip-ellipse-center-x';
const CLIP_ELLIPSE_CENTER_Y_CONTROL_ID = 'clip-ellipse-center-y';
const CLIP_POLYGON_P1_X_CONTROL_ID = 'clip-polygon-p1-x';
const CLIP_POLYGON_P1_Y_CONTROL_ID = 'clip-polygon-p1-y';
const CLIP_POLYGON_P2_X_CONTROL_ID = 'clip-polygon-p2-x';
const CLIP_POLYGON_P2_Y_CONTROL_ID = 'clip-polygon-p2-y';
const CLIP_POLYGON_P3_X_CONTROL_ID = 'clip-polygon-p3-x';
const CLIP_POLYGON_P3_Y_CONTROL_ID = 'clip-polygon-p3-y';
const CLIP_POLYGON_P4_X_CONTROL_ID = 'clip-polygon-p4-x';
const CLIP_POLYGON_P4_Y_CONTROL_ID = 'clip-polygon-p4-y';
const CLIP_PATH_M_X_CONTROL_ID = 'clip-path-m-x';
const CLIP_PATH_M_Y_CONTROL_ID = 'clip-path-m-y';
const CLIP_PATH_L2_X_CONTROL_ID = 'clip-path-l2-x';
const CLIP_PATH_L2_Y_CONTROL_ID = 'clip-path-l2-y';
const CLIP_PATH_L3_X_CONTROL_ID = 'clip-path-l3-x';
const CLIP_PATH_L3_Y_CONTROL_ID = 'clip-path-l3-y';
const CLIP_PATH_L4_X_CONTROL_ID = 'clip-path-l4-x';
const CLIP_PATH_L4_Y_CONTROL_ID = 'clip-path-l4-y';
const CLIP_RECT_TOP_CONTROL_ID = 'clip-rect-top';
const CLIP_RECT_RIGHT_CONTROL_ID = 'clip-rect-right';
const CLIP_RECT_BOTTOM_CONTROL_ID = 'clip-rect-bottom';
const CLIP_RECT_LEFT_CONTROL_ID = 'clip-rect-left';
const CLIP_XYWH_X_CONTROL_ID = 'clip-xywh-x';
const CLIP_XYWH_Y_CONTROL_ID = 'clip-xywh-y';
const CLIP_XYWH_WIDTH_CONTROL_ID = 'clip-xywh-width';
const CLIP_XYWH_HEIGHT_CONTROL_ID = 'clip-xywh-height';

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

  const clipCircleRadiusToken = activeTokens[CLIP_CIRCLE_RADIUS_CONTROL_ID];
  const clipCircleCenterXToken = activeTokens[CLIP_CIRCLE_CENTER_X_CONTROL_ID];
  const clipCircleCenterYToken = activeTokens[CLIP_CIRCLE_CENTER_Y_CONTROL_ID];

  if (clipCircleRadiusToken && clipCircleCenterXToken && clipCircleCenterYToken) {
    styles = {
      ...styles,
      itemA: {
        ...styles.itemA,
        clipPath: composeClipPathCircle(
          clipCircleRadiusToken,
          clipCircleCenterXToken,
          clipCircleCenterYToken
        ),
      },
    };
  }

  const clipEllipseRadiusXToken = activeTokens[CLIP_ELLIPSE_RADIUS_X_CONTROL_ID];
  const clipEllipseRadiusYToken = activeTokens[CLIP_ELLIPSE_RADIUS_Y_CONTROL_ID];
  const clipEllipseCenterXToken = activeTokens[CLIP_ELLIPSE_CENTER_X_CONTROL_ID];
  const clipEllipseCenterYToken = activeTokens[CLIP_ELLIPSE_CENTER_Y_CONTROL_ID];

  if (
    clipEllipseRadiusXToken &&
    clipEllipseRadiusYToken &&
    clipEllipseCenterXToken &&
    clipEllipseCenterYToken
  ) {
    styles = {
      ...styles,
      itemA: {
        ...styles.itemA,
        clipPath: composeClipPathEllipse(
          clipEllipseRadiusXToken,
          clipEllipseRadiusYToken,
          clipEllipseCenterXToken,
          clipEllipseCenterYToken
        ),
      },
    };
  }

  const clipPolygonP1XToken = activeTokens[CLIP_POLYGON_P1_X_CONTROL_ID];
  const clipPolygonP1YToken = activeTokens[CLIP_POLYGON_P1_Y_CONTROL_ID];
  const clipPolygonP2XToken = activeTokens[CLIP_POLYGON_P2_X_CONTROL_ID];
  const clipPolygonP2YToken = activeTokens[CLIP_POLYGON_P2_Y_CONTROL_ID];
  const clipPolygonP3XToken = activeTokens[CLIP_POLYGON_P3_X_CONTROL_ID];
  const clipPolygonP3YToken = activeTokens[CLIP_POLYGON_P3_Y_CONTROL_ID];
  const clipPolygonP4XToken = activeTokens[CLIP_POLYGON_P4_X_CONTROL_ID];
  const clipPolygonP4YToken = activeTokens[CLIP_POLYGON_P4_Y_CONTROL_ID];

  if (
    clipPolygonP1XToken &&
    clipPolygonP1YToken &&
    clipPolygonP2XToken &&
    clipPolygonP2YToken &&
    clipPolygonP3XToken &&
    clipPolygonP3YToken &&
    clipPolygonP4XToken &&
    clipPolygonP4YToken
  ) {
    styles = {
      ...styles,
      itemA: {
        ...styles.itemA,
        clipPath: composeClipPathPolygon(
          clipPolygonP1XToken,
          clipPolygonP1YToken,
          clipPolygonP2XToken,
          clipPolygonP2YToken,
          clipPolygonP3XToken,
          clipPolygonP3YToken,
          clipPolygonP4XToken,
          clipPolygonP4YToken
        ),
      },
    };
  }

  const clipPathMXToken = activeTokens[CLIP_PATH_M_X_CONTROL_ID];
  const clipPathMYToken = activeTokens[CLIP_PATH_M_Y_CONTROL_ID];
  const clipPathL2XToken = activeTokens[CLIP_PATH_L2_X_CONTROL_ID];
  const clipPathL2YToken = activeTokens[CLIP_PATH_L2_Y_CONTROL_ID];
  const clipPathL3XToken = activeTokens[CLIP_PATH_L3_X_CONTROL_ID];
  const clipPathL3YToken = activeTokens[CLIP_PATH_L3_Y_CONTROL_ID];
  const clipPathL4XToken = activeTokens[CLIP_PATH_L4_X_CONTROL_ID];
  const clipPathL4YToken = activeTokens[CLIP_PATH_L4_Y_CONTROL_ID];

  if (
    clipPathMXToken &&
    clipPathMYToken &&
    clipPathL2XToken &&
    clipPathL2YToken &&
    clipPathL3XToken &&
    clipPathL3YToken &&
    clipPathL4XToken &&
    clipPathL4YToken
  ) {
    styles = {
      ...styles,
      itemA: {
        ...styles.itemA,
        clipPath: composeClipPathPath(
          clipPathMXToken,
          clipPathMYToken,
          clipPathL2XToken,
          clipPathL2YToken,
          clipPathL3XToken,
          clipPathL3YToken,
          clipPathL4XToken,
          clipPathL4YToken
        ),
      },
    };
  }

  const clipRectTopToken = activeTokens[CLIP_RECT_TOP_CONTROL_ID];
  const clipRectRightToken = activeTokens[CLIP_RECT_RIGHT_CONTROL_ID];
  const clipRectBottomToken = activeTokens[CLIP_RECT_BOTTOM_CONTROL_ID];
  const clipRectLeftToken = activeTokens[CLIP_RECT_LEFT_CONTROL_ID];

  if (
    clipRectTopToken &&
    clipRectRightToken &&
    clipRectBottomToken &&
    clipRectLeftToken
  ) {
    styles = {
      ...styles,
      itemA: {
        ...styles.itemA,
        clipPath: composeClipPathRect(
          clipRectTopToken,
          clipRectRightToken,
          clipRectBottomToken,
          clipRectLeftToken
        ),
      },
    };
  }

  const clipXywhXToken = activeTokens[CLIP_XYWH_X_CONTROL_ID];
  const clipXywhYToken = activeTokens[CLIP_XYWH_Y_CONTROL_ID];
  const clipXywhWidthToken = activeTokens[CLIP_XYWH_WIDTH_CONTROL_ID];
  const clipXywhHeightToken = activeTokens[CLIP_XYWH_HEIGHT_CONTROL_ID];

  if (
    clipXywhXToken &&
    clipXywhYToken &&
    clipXywhWidthToken &&
    clipXywhHeightToken
  ) {
    styles = {
      ...styles,
      itemA: {
        ...styles.itemA,
        clipPath: composeClipPathXywh(
          clipXywhXToken,
          clipXywhYToken,
          clipXywhWidthToken,
          clipXywhHeightToken
        ),
      },
    };
  }

  return styles;
};
