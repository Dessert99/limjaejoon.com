/** raw 디자인 값 차단 규칙 — css.ts 에서 semantic·scale 토큰만 쓰게 한다 */

// 헤어라인 1px 은 밀도 무관 상수라 dimension 스케일(최솟값 2px)에 대응 토큰이 없다
const HAIRLINE = '1px';

// 단독 치수만 잡는다 — '1px solid …' 같은 복합 문자열은 매칭되지 않아 border 관용구가 살아남는다
const RAW_DIMENSION = /^-?\d*\.?\d+(?:px|rem|pt|cm|mm|in|pc|Q)$/;

// hex 는 8·6·4·3자리(4자리 #RGBA 포함)를 다 잡고 인자가 없어 어디서 발견되든 raw 색이 확정된다 — 토큰으로 치환될 여지가 없다
const RAW_COLOR_HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b/i;

// i 플래그로 RGB(...)·HSL(...) 대소문자를 무시하고, color( 는 (?<![\w-]) 로 background-color( 오매치를 배제한다 — 함수명만으론 raw 확정이 안 돼 quasi 스캔엔 안 쓴다
const RAW_COLOR_FN =
  /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color-mix)\(|(?<![\w-])color\(/i;

// 치환 템플릿 조각 스캔 전용 — color-mix·color() 는 인자가 토큰일 수 있어(Toggle.css.ts) 제외하고 나머지 색 함수만 raw 로 본다
const RAW_COLOR_FN_QUASI = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/i;

// 색 속성 화이트리스트 — 이 안의 속성만 문자열 값을 named color 로 판정한다(content 같은 텍스트 속성 오탐 방지)
const COLOR_PROPS = new Set([
  'color',
  'background',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderInlineColor',
  'borderBlockColor',
  'outlineColor',
  'fill',
  'stroke',
  'caretColor',
  'textDecorationColor',
  'columnRuleColor',
  'accentColor',
]);

// CSS Color Module Level 4 named colors — transparent·currentColor 등 키워드는 색 이름이 아니라 의도적으로 뺐다
const NAMED_COLORS = new Set(
  (
    'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue ' +
    'blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk ' +
    'crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki ' +
    'darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen ' +
    'darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue ' +
    'dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite ' +
    'gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki ' +
    'lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan ' +
    'lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen ' +
    'lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen ' +
    'magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen ' +
    'mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream ' +
    'mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid ' +
    'palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum ' +
    'powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown ' +
    'seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen ' +
    'steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen'
  ).split(' ')
);

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
        // 치환이 있으면 조각이 'color-mix(in srgb, ' 처럼 함수 인자가 토큰일 수 있는 복합값이라 mixing 계열은 빼고 본다
        const colored = node.quasis.find((quasi) => {
          return (
            RAW_COLOR_HEX.test(quasi.value.raw) ||
            RAW_COLOR_FN_QUASI.test(quasi.value.raw)
          );
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
        if (node.computed) {
          return;
        }
        const value = node.value;
        // 부호 있는 숫자는 UnaryExpression(+/-, Literal)로, TS as/satisfies 캐스트는 Literal을 감싸므로 둘 다 풀어야 밑의 리터럴이 드러난다
        let literal = value;
        while (
          (literal.type === 'UnaryExpression' &&
            (literal.operator === '-' || literal.operator === '+')) ||
          literal.type === 'TSAsExpression' ||
          literal.type === 'TSSatisfiesExpression'
        ) {
          literal =
            literal.type === 'UnaryExpression'
              ? literal.argument
              : literal.expression;
        }
        if (literal.type !== 'Literal') {
          return;
        }
        const name =
          node.key.type === 'Identifier' ? node.key.name : node.key.value;
        // 색 속성의 문자열 값은 named-color 화이트리스트로만 판정한다 — content 같은 텍스트 속성은 COLOR_PROPS 밖이라 안전하다
        if (typeof literal.value === 'string') {
          if (
            COLOR_PROPS.has(name) &&
            NAMED_COLORS.has(literal.value.trim().toLowerCase())
          ) {
            context.report({
              node: value,
              messageId: 'rawColor',
              data: { value: literal.value },
            });
          }
          return;
        }
        // 숫자는 길이 속성에서만 본다 — lineHeight·fontWeight·zIndex 등은 unitless 가 정상이다
        if (typeof literal.value !== 'number' || literal.value === 0) {
          return;
        }
        if (LENGTH_PROPS.has(name)) {
          context.report({
            node: value,
            messageId: 'rawDimension',
            data: { value: context.sourceCode.getText(value) },
          });
        }
      },
    };
  },
};

export default noRawDesignValues;
