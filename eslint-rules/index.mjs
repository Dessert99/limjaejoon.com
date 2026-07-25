/** design-tokens ESLint 플러그인 — 프로젝트 전용 토큰 규율 규칙 모음 */
import noRawDesignValues from './no-raw-design-values.mjs';

/** eslint.config.mjs 의 plugins 에 배선하는 플러그인 객체 */
export default {
  rules: { 'no-raw-design-values': noRawDesignValues },
};
