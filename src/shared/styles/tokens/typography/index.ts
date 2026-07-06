import { fontFamily, fontSize, fontWeight, lineHeight } from './scale';
import { text } from './text';

/** typography scale 과 text 재노출 */
export { fontFamily, fontSize, fontWeight, lineHeight, text };

/** typography token namespace — scale 과 semantic text 를 함께 제공한다 */
export const typography = {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  text,
} as const;
