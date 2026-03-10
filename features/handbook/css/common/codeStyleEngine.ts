// control 타입을 입력으로 받아 CSS 표시 문자열을 계산합니다.
import type { SnippetControl } from '@/features/handbook/css/common/types';
import {
  composeBorderRadius,
  composeBoxShadow,
} from '@/features/handbook/css/properties/border/compose';
import {
  composeClipPathCircle,
  composeClipPathEllipse,
  composeClipPathPath,
  composeClipPathPolygon,
  composeClipPathRect,
  composeClipPathXywh,
} from '@/features/handbook/css/properties/clip-path/compose';

const SHADOW_DIRECTION_CONTROL_ID = 'shadow-direction';
const SHADOW_BLUR_CONTROL_ID = 'shadow-blur';
const SHADOW_COLOR_CONTROL_ID = 'shadow-color';
const BORDER_RADIUS_SHORTHAND_TOP_LEFT_CONTROL_ID =
  'border-radius-shorthand-top-left';
const BORDER_RADIUS_SHORTHAND_TOP_RIGHT_CONTROL_ID =
  'border-radius-shorthand-top-right';
const BORDER_RADIUS_SHORTHAND_BOTTOM_RIGHT_CONTROL_ID =
  'border-radius-shorthand-bottom-right';
const BORDER_RADIUS_SHORTHAND_BOTTOM_LEFT_CONTROL_ID =
  'border-radius-shorthand-bottom-left';
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

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const replaceCssDeclaration = (
  cssCode: string,
  property: string,
  value: string
): string => {
  const pattern = new RegExp(
    `(${escapeRegExp(property)}\\s*:\\s*)([^;]+)(;)`,
    'g'
  );

  return cssCode.replace(pattern, `$1${value}$3`);
};

const replaceCssDeclarationInSelector = (
  cssCode: string,
  selector: string,
  property: string,
  value: string
): string => {
  const pattern = new RegExp(
    `(${escapeRegExp(selector)}\\s*\\{[^}]*?)(${escapeRegExp(property)}\\s*:\\s*)([^;]+)(;)`
  );

  return cssCode.replace(pattern, `$1$2${value}$4`);
};

const getActiveToken = (
  controls: SnippetControl[],
  selectedTokens: Record<string, string>,
  controlId: string
): string | undefined => {
  const control = controls.find((item) => item.id === controlId);

  if (!control) {
    return undefined;
  }

  return selectedTokens[control.id] ?? control.defaultStyleToken;
};

// 속성 버튼 선택 상태를 기반으로 '표시용 CSS 코드'를 계산합니다.
export const computeDisplayCssCode = (
  baseCssCode: string,
  controls: SnippetControl[],
  selectedTokens: Record<string, string>
): string => {
  let nextCode = baseCssCode;

  for (const control of controls) {
    const activeToken = selectedTokens[control.id] ?? control.defaultStyleToken;
    const activeOption = control.options.find(
      (option) => option.styleToken === activeToken
    );

    if (!activeOption?.cssDeclarations?.length) {
      continue;
    }

    for (const declaration of activeOption.cssDeclarations) {
      if (declaration.selector) {
        nextCode = replaceCssDeclarationInSelector(
          nextCode,
          declaration.selector,
          declaration.property,
          declaration.value
        );
        continue;
      }

      nextCode = replaceCssDeclaration(nextCode, declaration.property, declaration.value);
    }
  }

  const shadowDirectionToken = getActiveToken(
    controls,
    selectedTokens,
    SHADOW_DIRECTION_CONTROL_ID
  );
  const shadowBlurToken = getActiveToken(
    controls,
    selectedTokens,
    SHADOW_BLUR_CONTROL_ID
  );
  const shadowColorToken = getActiveToken(
    controls,
    selectedTokens,
    SHADOW_COLOR_CONTROL_ID
  );

  if (shadowDirectionToken && shadowBlurToken && shadowColorToken) {
    nextCode = replaceCssDeclaration(
      nextCode,
      'box-shadow',
      composeBoxShadow(shadowDirectionToken, shadowBlurToken, shadowColorToken)
    );
  }

  const borderRadiusTopLeftToken = getActiveToken(
    controls,
    selectedTokens,
    BORDER_RADIUS_SHORTHAND_TOP_LEFT_CONTROL_ID
  );
  const borderRadiusTopRightToken = getActiveToken(
    controls,
    selectedTokens,
    BORDER_RADIUS_SHORTHAND_TOP_RIGHT_CONTROL_ID
  );
  const borderRadiusBottomRightToken = getActiveToken(
    controls,
    selectedTokens,
    BORDER_RADIUS_SHORTHAND_BOTTOM_RIGHT_CONTROL_ID
  );
  const borderRadiusBottomLeftToken = getActiveToken(
    controls,
    selectedTokens,
    BORDER_RADIUS_SHORTHAND_BOTTOM_LEFT_CONTROL_ID
  );

  if (
    borderRadiusTopLeftToken &&
    borderRadiusTopRightToken &&
    borderRadiusBottomRightToken &&
    borderRadiusBottomLeftToken
  ) {
    nextCode = replaceCssDeclaration(
      nextCode,
      'border-radius',
      composeBorderRadius(
        borderRadiusTopLeftToken,
        borderRadiusTopRightToken,
        borderRadiusBottomRightToken,
        borderRadiusBottomLeftToken
      )
    );
  }

  const clipCircleRadiusToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_CIRCLE_RADIUS_CONTROL_ID
  );
  const clipCircleCenterXToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_CIRCLE_CENTER_X_CONTROL_ID
  );
  const clipCircleCenterYToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_CIRCLE_CENTER_Y_CONTROL_ID
  );

  if (clipCircleRadiusToken && clipCircleCenterXToken && clipCircleCenterYToken) {
    nextCode = replaceCssDeclaration(
      nextCode,
      'clip-path',
      composeClipPathCircle(
        clipCircleRadiusToken,
        clipCircleCenterXToken,
        clipCircleCenterYToken
      )
    );
  }

  const clipEllipseRadiusXToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_ELLIPSE_RADIUS_X_CONTROL_ID
  );
  const clipEllipseRadiusYToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_ELLIPSE_RADIUS_Y_CONTROL_ID
  );
  const clipEllipseCenterXToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_ELLIPSE_CENTER_X_CONTROL_ID
  );
  const clipEllipseCenterYToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_ELLIPSE_CENTER_Y_CONTROL_ID
  );

  if (
    clipEllipseRadiusXToken &&
    clipEllipseRadiusYToken &&
    clipEllipseCenterXToken &&
    clipEllipseCenterYToken
  ) {
    nextCode = replaceCssDeclaration(
      nextCode,
      'clip-path',
      composeClipPathEllipse(
        clipEllipseRadiusXToken,
        clipEllipseRadiusYToken,
        clipEllipseCenterXToken,
        clipEllipseCenterYToken
      )
    );
  }

  const clipPolygonP1XToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_POLYGON_P1_X_CONTROL_ID
  );
  const clipPolygonP1YToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_POLYGON_P1_Y_CONTROL_ID
  );
  const clipPolygonP2XToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_POLYGON_P2_X_CONTROL_ID
  );
  const clipPolygonP2YToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_POLYGON_P2_Y_CONTROL_ID
  );
  const clipPolygonP3XToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_POLYGON_P3_X_CONTROL_ID
  );
  const clipPolygonP3YToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_POLYGON_P3_Y_CONTROL_ID
  );
  const clipPolygonP4XToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_POLYGON_P4_X_CONTROL_ID
  );
  const clipPolygonP4YToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_POLYGON_P4_Y_CONTROL_ID
  );

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
    nextCode = replaceCssDeclaration(
      nextCode,
      'clip-path',
      composeClipPathPolygon(
        clipPolygonP1XToken,
        clipPolygonP1YToken,
        clipPolygonP2XToken,
        clipPolygonP2YToken,
        clipPolygonP3XToken,
        clipPolygonP3YToken,
        clipPolygonP4XToken,
        clipPolygonP4YToken
      )
    );
  }

  const clipPathMXToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_PATH_M_X_CONTROL_ID
  );
  const clipPathMYToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_PATH_M_Y_CONTROL_ID
  );
  const clipPathL2XToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_PATH_L2_X_CONTROL_ID
  );
  const clipPathL2YToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_PATH_L2_Y_CONTROL_ID
  );
  const clipPathL3XToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_PATH_L3_X_CONTROL_ID
  );
  const clipPathL3YToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_PATH_L3_Y_CONTROL_ID
  );
  const clipPathL4XToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_PATH_L4_X_CONTROL_ID
  );
  const clipPathL4YToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_PATH_L4_Y_CONTROL_ID
  );

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
    nextCode = replaceCssDeclaration(
      nextCode,
      'clip-path',
      composeClipPathPath(
        clipPathMXToken,
        clipPathMYToken,
        clipPathL2XToken,
        clipPathL2YToken,
        clipPathL3XToken,
        clipPathL3YToken,
        clipPathL4XToken,
        clipPathL4YToken
      )
    );
  }

  const clipRectTopToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_RECT_TOP_CONTROL_ID
  );
  const clipRectRightToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_RECT_RIGHT_CONTROL_ID
  );
  const clipRectBottomToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_RECT_BOTTOM_CONTROL_ID
  );
  const clipRectLeftToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_RECT_LEFT_CONTROL_ID
  );

  if (
    clipRectTopToken &&
    clipRectRightToken &&
    clipRectBottomToken &&
    clipRectLeftToken
  ) {
    nextCode = replaceCssDeclaration(
      nextCode,
      'clip-path',
      composeClipPathRect(
        clipRectTopToken,
        clipRectRightToken,
        clipRectBottomToken,
        clipRectLeftToken
      )
    );
  }

  const clipXywhXToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_XYWH_X_CONTROL_ID
  );
  const clipXywhYToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_XYWH_Y_CONTROL_ID
  );
  const clipXywhWidthToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_XYWH_WIDTH_CONTROL_ID
  );
  const clipXywhHeightToken = getActiveToken(
    controls,
    selectedTokens,
    CLIP_XYWH_HEIGHT_CONTROL_ID
  );

  if (
    clipXywhXToken &&
    clipXywhYToken &&
    clipXywhWidthToken &&
    clipXywhHeightToken
  ) {
    nextCode = replaceCssDeclaration(
      nextCode,
      'clip-path',
      composeClipPathXywh(
        clipXywhXToken,
        clipXywhYToken,
        clipXywhWidthToken,
        clipXywhHeightToken
      )
    );
  }

  return nextCode;
};
