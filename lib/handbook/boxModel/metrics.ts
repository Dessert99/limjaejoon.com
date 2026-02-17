import type { CSSProperties } from 'react';

export interface BoxModelMetrics {
  boxSizing: 'content-box' | 'border-box';
  declaredWidth: number;
  declaredHeight: number;
  padding: number;
  borderWidth: number;
  borderBoxWidth: number;
  borderBoxHeight: number;
  paddingBoxWidth: number;
  paddingBoxHeight: number;
  contentBoxWidth: number;
  contentBoxHeight: number;
}

const DEFAULT_WIDTH = 180;
const DEFAULT_HEIGHT = 92;
const DEFAULT_PADDING = 20;
const DEFAULT_BORDER_WIDTH = 6;

// CSS 픽셀 단위를 number로 파싱합니다. (예: "20px" -> 20)
const parsePx = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(value, 0);
  }

  if (typeof value !== 'string') {
    return null;
  }

  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/i);

  if (!match) {
    return null;
  }

  return Math.max(Number(match[1]), 0);
};

// border shorthand(예: "6px solid #111")에서 border-width를 읽습니다.
const parseBorderWidthFromShorthand = (value: unknown): number | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/(-?\d+(?:\.\d+)?)px/i);

  if (!match) {
    return null;
  }

  return Math.max(Number(match[1]), 0);
};

// 미리보기 스타일에서 box model 계산용 수치를 안전하게 추출합니다.
export const resolveBoxModelMetrics = (style: CSSProperties): BoxModelMetrics => {
  const declaredWidth = parsePx(style.width) ?? DEFAULT_WIDTH;
  const declaredHeight =
    parsePx(style.minHeight) ?? parsePx(style.height) ?? DEFAULT_HEIGHT;
  const padding = parsePx(style.padding) ?? DEFAULT_PADDING;
  const borderWidth =
    parsePx(style.borderWidth) ??
    parseBorderWidthFromShorthand(style.border) ??
    DEFAULT_BORDER_WIDTH;
  const boxSizing = style.boxSizing === 'content-box' ? 'content-box' : 'border-box';

  let borderBoxWidth = declaredWidth;
  let borderBoxHeight = declaredHeight;
  let paddingBoxWidth = declaredWidth;
  let paddingBoxHeight = declaredHeight;
  let contentBoxWidth = declaredWidth;
  let contentBoxHeight = declaredHeight;

  if (boxSizing === 'content-box') {
    contentBoxWidth = declaredWidth;
    contentBoxHeight = declaredHeight;
    paddingBoxWidth = contentBoxWidth + padding * 2;
    paddingBoxHeight = contentBoxHeight + padding * 2;
    borderBoxWidth = paddingBoxWidth + borderWidth * 2;
    borderBoxHeight = paddingBoxHeight + borderWidth * 2;
  } else {
    borderBoxWidth = declaredWidth;
    borderBoxHeight = declaredHeight;
    paddingBoxWidth = Math.max(borderBoxWidth - borderWidth * 2, 1);
    paddingBoxHeight = Math.max(borderBoxHeight - borderWidth * 2, 1);
    contentBoxWidth = Math.max(paddingBoxWidth - padding * 2, 1);
    contentBoxHeight = Math.max(paddingBoxHeight - padding * 2, 1);
  }

  return {
    boxSizing,
    declaredWidth,
    declaredHeight,
    padding,
    borderWidth,
    borderBoxWidth,
    borderBoxHeight,
    paddingBoxWidth,
    paddingBoxHeight,
    contentBoxWidth,
    contentBoxHeight,
  };
};
