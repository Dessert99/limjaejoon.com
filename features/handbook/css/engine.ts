import type { SnippetControl } from '@/features/handbook/types';
import { composeBoxShadow } from '@/features/handbook/shadow/compose';

// 정규식 특수문자를 이스케이프해서 안전한 패턴으로 바꿉니다.
const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// 특정 CSS 속성의 값을 새 값으로 교체합니다.
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

// 특정 control의 현재 활성 styleToken을 찾습니다.
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
      nextCode = replaceCssDeclaration(
        nextCode,
        declaration.property,
        declaration.value
      );
    }
  }

  // box-shadow 상세 조합(방향/blur/색상) 컨트롤이 있으면 최종 값을 재계산합니다.
  const shadowDirectionToken = getActiveToken(
    controls,
    selectedTokens,
    'shadow-direction'
  );
  const shadowBlurToken = getActiveToken(controls, selectedTokens, 'shadow-blur');
  const shadowColorToken = getActiveToken(
    controls,
    selectedTokens,
    'shadow-color'
  );

  if (shadowDirectionToken && shadowBlurToken && shadowColorToken) {
    nextCode = replaceCssDeclaration(
      nextCode,
      'box-shadow',
      composeBoxShadow(shadowDirectionToken, shadowBlurToken, shadowColorToken)
    );
  }

  return nextCode;
};
