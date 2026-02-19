// React style 객체 타입을 수치 계산 입력 타입으로 사용합니다.
import type { CSSProperties } from 'react';

export interface BoxModelMetrics {
  // 현재 계산이 content-box 기준인지 border-box 기준인지 표시합니다.
  boxSizing: 'content-box' | 'border-box';
  // 스타일에 선언된 너비(width) 값입니다.
  declaredWidth: number;
  // 스타일에 선언된 높이(minHeight/height) 값입니다.
  declaredHeight: number;
  // padding 단일 값(px) 입니다.
  padding: number;
  // border-width 단일 값(px) 입니다.
  borderWidth: number;
  // 최종 border box 너비입니다.
  borderBoxWidth: number;
  // 최종 border box 높이입니다.
  borderBoxHeight: number;
  // padding box 너비입니다.
  paddingBoxWidth: number;
  // padding box 높이입니다.
  paddingBoxHeight: number;
  // content box 너비입니다.
  contentBoxWidth: number;
  // content box 높이입니다.
  contentBoxHeight: number;
}

// width가 없을 때 사용할 기본값입니다.
const DEFAULT_WIDTH = 180;
// height가 없을 때 사용할 기본값입니다.
const DEFAULT_HEIGHT = 92;
// padding이 없을 때 사용할 기본값입니다.
const DEFAULT_PADDING = 20;
// border-width가 없을 때 사용할 기본값입니다.
const DEFAULT_BORDER_WIDTH = 6;

// CSS 픽셀 단위를 number로 파싱합니다. (예: "20px" -> 20)
const parsePx = (value: unknown): number | null => {
  // number 타입이면 그대로 픽셀값으로 간주하고 음수는 0으로 보정합니다.
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(value, 0);
  }

  // 문자열이 아니면 px 파싱이 불가능하므로 null을 반환합니다.
  if (typeof value !== 'string') {
    return null;
  }

  // "20px" 형태만 허용하도록 정규식으로 검증합니다.
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/i);

  // px 형태가 아니면 null을 반환합니다.
  if (!match) {
    return null;
  }

  // 숫자로 변환하고 음수는 0으로 보정해 반환합니다.
  return Math.max(Number(match[1]), 0);
};

// border shorthand(예: "6px solid #111")에서 border-width를 읽습니다.
const parseBorderWidthFromShorthand = (value: unknown): number | null => {
  // border shorthand 문자열이 아니면 파싱하지 않습니다.
  if (typeof value !== 'string') {
    return null;
  }

  // "6px solid #111" 같은 문자열에서 첫 px 숫자를 추출합니다.
  const match = value.match(/(-?\d+(?:\.\d+)?)px/i);

  // 추출 실패 시 null을 반환합니다.
  if (!match) {
    return null;
  }

  // 추출한 값을 숫자로 변환하고 음수는 0으로 보정합니다.
  return Math.max(Number(match[1]), 0);
};

// 미리보기 스타일에서 box model 계산용 수치를 안전하게 추출합니다.
export const resolveBoxModelMetrics = (style: CSSProperties): BoxModelMetrics => {
  // width를 px로 읽고 없으면 기본값을 사용합니다.
  const declaredWidth = parsePx(style.width) ?? DEFAULT_WIDTH;
  // minHeight 우선, 없으면 height, 둘 다 없으면 기본 높이를 사용합니다.
  const declaredHeight =
    parsePx(style.minHeight) ?? parsePx(style.height) ?? DEFAULT_HEIGHT;
  // padding을 px로 읽고 없으면 기본값을 사용합니다.
  const padding = parsePx(style.padding) ?? DEFAULT_PADDING;
  // border-width를 우선 읽고, 없으면 border shorthand에서 읽고, 마지막으로 기본값을 사용합니다.
  const borderWidth =
    parsePx(style.borderWidth) ??
    parseBorderWidthFromShorthand(style.border) ??
    DEFAULT_BORDER_WIDTH;
  // boxSizing은 content-box일 때만 content-box로 두고, 나머지는 border-box로 처리합니다.
  const boxSizing = style.boxSizing === 'content-box' ? 'content-box' : 'border-box';

  // 계산 변수들을 선언된 크기로 초기화합니다.
  let borderBoxWidth = declaredWidth;
  let borderBoxHeight = declaredHeight;
  let paddingBoxWidth = declaredWidth;
  let paddingBoxHeight = declaredHeight;
  let contentBoxWidth = declaredWidth;
  let contentBoxHeight = declaredHeight;

  // content-box에서는 declared 값이 content 기준이므로 바깥 레이어를 더해갑니다.
  if (boxSizing === 'content-box') {
    // content box를 선언 값 그대로 둡니다.
    contentBoxWidth = declaredWidth;
    contentBoxHeight = declaredHeight;
    // padding을 양쪽으로 더해 padding box를 계산합니다.
    paddingBoxWidth = contentBoxWidth + padding * 2;
    paddingBoxHeight = contentBoxHeight + padding * 2;
    // border를 양쪽으로 더해 border box를 계산합니다.
    borderBoxWidth = paddingBoxWidth + borderWidth * 2;
    borderBoxHeight = paddingBoxHeight + borderWidth * 2;
  } else {
    // border-box에서는 declared 값이 border 기준입니다.
    borderBoxWidth = declaredWidth;
    borderBoxHeight = declaredHeight;
    // border를 빼서 padding box를 계산하고 최소 1px을 보장합니다.
    paddingBoxWidth = Math.max(borderBoxWidth - borderWidth * 2, 1);
    paddingBoxHeight = Math.max(borderBoxHeight - borderWidth * 2, 1);
    // padding을 빼서 content box를 계산하고 최소 1px을 보장합니다.
    contentBoxWidth = Math.max(paddingBoxWidth - padding * 2, 1);
    contentBoxHeight = Math.max(paddingBoxHeight - padding * 2, 1);
  }

  // 계산된 box model 수치를 한 객체로 반환합니다.
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
