/** raw 디자인 값 차단 규칙 — css.ts 에서 semantic·scale 토큰만 쓰게 한다 */

// 헤어라인 1px 은 밀도 무관 상수라 dimension 스케일(최솟값 2px)에 대응 토큰이 없다
const HAIRLINE = '1px';

// 단독 치수만 잡는다 — '1px solid …' 같은 복합 문자열은 매칭되지 않아 border 관용구가 살아남는다
const RAW_DIMENSION = /^-?\d*\.?\d+(?:px|rem)$/;

// 8·6·4·3자리 hex 를 긴 것부터 시도한다 — 4자리(#RGBA)도 CSS 유효 문법이라 포함한다
// i 플래그 필수: CSS 함수명은 대소문자를 안 가려서 RGB(...)·HSL(...) 도 유효한 raw 색이다
const RAW_COLOR =
  /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b|\b(?:rgba?|hsla?)\(/i;

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
        if (RAW_COLOR.test(node.value)) {
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
        // 치환 없는 템플릿은 따옴표 문자열과 동치라 치수까지 본다 — `37px` 우회를 막는다
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
        }
        // 치환이 있으면 조각이 '1px solid ' 같은 복합값이라 색만 본다
        const colored = node.quasis.find((quasi) => {
          return RAW_COLOR.test(quasi.value.raw);
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
    };
  },
};

export default noRawDesignValues;
