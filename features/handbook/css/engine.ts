// control 타입을 입력으로 받아 CSS 표시 문자열을 계산합니다.
import type { SnippetControl } from '@/features/handbook/types';
// shadow 3요소를 실제 box-shadow 문자열로 합성하는 유틸입니다.
import { composeBoxShadow } from '@/features/handbook/shadow/compose';

// shadow 방향 control id 상수입니다.
const SHADOW_DIRECTION_CONTROL_ID = 'shadow-direction';
// shadow blur control id 상수입니다.
const SHADOW_BLUR_CONTROL_ID = 'shadow-blur';
// shadow 색상 control id 상수입니다.
const SHADOW_COLOR_CONTROL_ID = 'shadow-color';

// 정규식 특수문자를 이스케이프해서 안전한 패턴으로 바꿉니다.
const escapeRegExp = (value: string): string => {
  // 정규식 메타 문자를 모두 이스케이프해 안전한 문자열 패턴을 만듭니다.
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// 특정 CSS 속성의 값을 새 값으로 교체합니다.
const replaceCssDeclaration = (
  cssCode: string,
  property: string,
  value: string
): string => {
  // 교체할 CSS property 기준으로 "property: value;" 패턴 정규식을 만듭니다.
  const pattern = new RegExp(
    `(${escapeRegExp(property)}\\s*:\\s*)([^;]+)(;)`,
    'g'
  );

  // 기존 value 부분만 새 값으로 교체합니다.
  return cssCode.replace(pattern, `$1${value}$3`);
};

// 특정 control의 현재 활성 styleToken을 찾습니다.
const getActiveToken = (
  controls: SnippetControl[],
  selectedTokens: Record<string, string>,
  controlId: string
): string | undefined => {
  // controlId와 일치하는 control을 찾습니다.
  const control = controls.find((item) => item.id === controlId);

  // control이 없으면 token을 구할 수 없으므로 undefined를 반환합니다.
  if (!control) {
    return undefined;
  }

  // 사용자가 고른 값이 있으면 사용하고, 없으면 default token을 사용합니다.
  return selectedTokens[control.id] ?? control.defaultStyleToken;
};

// 속성 버튼 선택 상태를 기반으로 '표시용 CSS 코드'를 계산합니다.
export const computeDisplayCssCode = (
  baseCssCode: string,
  controls: SnippetControl[],
  selectedTokens: Record<string, string>
): string => {
  // base CSS에서 시작해 선택된 값들을 순차 반영합니다.
  let nextCode = baseCssCode;

  // 모든 control을 순회하며 각 control의 활성 옵션을 찾습니다.
  for (const control of controls) {
    // control별 활성 token을 결정합니다.
    const activeToken = selectedTokens[control.id] ?? control.defaultStyleToken;
    // 활성 token에 대응하는 옵션 객체를 찾습니다.
    const activeOption = control.options.find(
      (option) => option.styleToken === activeToken
    );

    // CSS 교체 선언이 없는 옵션이면 건너뜁니다.
    if (!activeOption?.cssDeclarations?.length) {
      continue;
    }

    // 옵션이 가진 declaration들을 하나씩 코드 문자열에 반영합니다.
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

  // shadow 3요소가 모두 있을 때만 box-shadow를 최종 조합해 한 번 더 덮어씁니다.
  if (shadowDirectionToken && shadowBlurToken && shadowColorToken) {
    nextCode = replaceCssDeclaration(
      nextCode,
      'box-shadow',
      composeBoxShadow(shadowDirectionToken, shadowBlurToken, shadowColorToken)
    );
  }

  // 최종 표시용 CSS 문자열을 반환합니다.
  return nextCode;
};
