// control 타입을 입력으로 받아 CSS 표시 문자열을 계산합니다.
import type { SnippetControl } from '@/features/handbook/css/common/types';
import {
  composeBorderRadius,
  composeBoxShadow,
} from '@/features/handbook/css/properties/border/compose';

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

  return nextCode;
};
