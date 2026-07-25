/** raw 디자인 값 차단 규칙 — css.ts 에서 semantic·scale 토큰만 쓰게 한다 */

// 헤어라인 1px 은 밀도 무관 상수라 dimension 스케일(최솟값 2px)에 대응 토큰이 없다
const HAIRLINE = '1px';

// 단독 치수만 잡는다 — '1px solid …' 같은 복합 문자열은 매칭되지 않아 border 관용구가 살아남는다
const RAW_DIMENSION = /^-?\d*\.?\d+(?:px|rem)$/;

// 8·6·4·3자리 hex 를 긴 것부터 시도한다 — 4자리(#RGBA)도 CSS 유효 문법이라 포함한다
// hex 는 어디서 발견되든 raw 색이 확정된다 — 함수 인자와 달리 토큰으로 치환될 여지가 없는 리터럴이다
const RAW_COLOR_HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b/i;

// i 플래그 필수: CSS 함수명은 대소문자를 안 가려서 RGB(...)·HSL(...) 도 유효한 raw 색이다
// color\( 은 \b 로 앞을 막아도 background-color( 의 color( 부분에 걸린다 — (?<![\w-]) 로 식별자 중간 시작을 배제한다
// 함수명만으론 raw 확정이 안 된다 — color-mix(in srgb, ${token} ...) 처럼 인자가 토큰일 수 있어 quasi 조각 스캔에는 안 쓴다
const RAW_COLOR_FN =
  /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color-mix)\(|(?<![\w-])color\(/i;

// vanilla-extract 가 unitless 숫자를 px 로 직렬화하는 속성들 — allowlist 라 오탐이 구조적으로 불가능하다
const LENGTH_PROPS = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'blockSize',
  'inlineSize',
  'minBlockSize',
  'maxBlockSize',
  'minInlineSize',
  'maxInlineSize',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'insetInline',
  'insetInlineStart',
  'insetInlineEnd',
  'insetBlock',
  'insetBlockStart',
  'insetBlockEnd',
  'gap',
  'rowGap',
  'columnGap',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingInline',
  'paddingInlineStart',
  'paddingInlineEnd',
  'paddingBlock',
  'paddingBlockStart',
  'paddingBlockEnd',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginInline',
  'marginInlineStart',
  'marginInlineEnd',
  'marginBlock',
  'marginBlockStart',
  'marginBlockEnd',
  'fontSize',
  'letterSpacing',
  'wordSpacing',
  'textIndent',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'outlineOffset',
  'outlineWidth',
  'borderWidth',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderInlineWidth',
  'borderBlockWidth',
  'flexBasis',
]);

/** ESLint 규칙 — raw 치수·색 리터럴과 palette 직접 import 를 막는다 */
const noRawDesignValues = {
  meta: {
    type: 'problem',
    docs: {
      description: 'raw 디자인 값 대신 semantic·scale 토큰을 쓰게 한다',
    },
    messages: {
      rawDimension:
        "raw 치수 '{{value}}' 대신 vars.dimension·vars.container·vars.typography 토큰을 쓰세요.",
      rawColor: "raw 색 '{{value}}' 대신 vars.color semantic 토큰을 쓰세요.",
      paletteImport:
        'palette 직접 import 금지 — vars.color semantic 토큰을 쓰세요.',
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') {
          return;
        }
        // 문자열 리터럴은 인자까지 전부 static 이라 hex·함수명 둘 다 raw 색으로 확정된다
        if (RAW_COLOR_HEX.test(node.value) || RAW_COLOR_FN.test(node.value)) {
          context.report({
            node,
            messageId: 'rawColor',
            data: { value: node.value },
          });
          return;
        }
        if (node.value === HAIRLINE) {
          return;
        }
        if (RAW_DIMENSION.test(node.value)) {
          context.report({
            node,
            messageId: 'rawDimension',
            data: { value: node.value },
          });
        }
      },
      TemplateLiteral(node) {
        // 치환 없는 템플릿은 따옴표 문자열과 동치라 치수·hex·함수명 raw 색까지 전부 본다 — `37px` 우회를 막는다
        if (node.expressions.length === 0) {
          const only = node.quasis[0].value.raw;
          if (only !== HAIRLINE && RAW_DIMENSION.test(only)) {
            context.report({
              node,
              messageId: 'rawDimension',
              data: { value: only },
            });
            return;
          }
          if (RAW_COLOR_HEX.test(only) || RAW_COLOR_FN.test(only)) {
            context.report({
              node,
              messageId: 'rawColor',
              data: { value: only },
            });
          }
          return;
        }
        // 치환이 있으면 조각이 'color-mix(in srgb, ' 처럼 함수 인자가 토큰일 수 있는 복합값이라 hex 만 본다
        const colored = node.quasis.find((quasi) => {
          return RAW_COLOR_HEX.test(quasi.value.raw);
        });
        if (colored) {
          context.report({
            node,
            messageId: 'rawColor',
            data: { value: colored.value.raw.trim() },
          });
        }
      },
      ImportDeclaration(node) {
        // 경로가 아니라 바인딩 이름으로 잡는다 — palette 는 배럴 3경로로 재노출된다
        const importsPalette = node.specifiers.some((specifier) => {
          return (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.name === 'palette'
          );
        });
        if (importsPalette) {
          context.report({ node, messageId: 'paletteImport' });
        }
      },
      MemberExpression(node) {
        // namespace import(`import * as tokens`)는 ImportSpecifier 를 안 남기니 접근 지점에서 잡는다
        if (!node.computed && node.property.name === 'palette') {
          context.report({ node, messageId: 'paletteImport' });
        }
      },
      Property(node) {
        // 숫자는 길이 속성에서만 본다 — lineHeight·fontWeight·zIndex 등은 unitless 가 정상이다
        if (node.computed) {
          return;
        }
        // 음수 리터럴은 파서가 UnaryExpression(-, Literal) 로 쪼개므로 풀어서 검사한다
        const value = node.value;
        const literal =
          value.type === 'UnaryExpression' && value.operator === '-'
            ? value.argument
            : value;
        if (literal.type !== 'Literal') {
          return;
        }
        if (typeof literal.value !== 'number' || literal.value === 0) {
          return;
        }
        const name =
          node.key.type === 'Identifier' ? node.key.name : node.key.value;
        if (LENGTH_PROPS.has(name)) {
          context.report({
            node: value,
            messageId: 'rawDimension',
            data: {
              value:
                value === literal ? String(literal.value) : `-${literal.value}`,
            },
          });
        }
      },
    };
  },
};

export default noRawDesignValues;
