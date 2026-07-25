/** raw 디자인 값 차단 규칙 — css.ts 에서 semantic·scale 토큰만 쓰게 한다 */

// 헤어라인 1px 은 밀도 무관 상수라 dimension 스케일(최솟값 2px)에 대응 토큰이 없다
const HAIRLINE = '1px';

// 단독 치수만 잡는다 — '1px solid …' 같은 복합 문자열은 매칭되지 않아 border 관용구가 살아남는다
const RAW_DIMENSION = /^-?\d*\.?\d+(?:px|rem)$/;

/** ESLint 규칙 — raw 치수·색 리터럴과 palette 직접 import 를 막는다 */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'raw 디자인 값 대신 semantic·scale 토큰을 쓰게 한다',
    },
    messages: {
      rawDimension:
        "raw 치수 '{{value}}' 대신 vars.dimension·vars.container·vars.typography 토큰을 쓰세요.",
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') {
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
    };
  },
};
