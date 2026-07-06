/** light theme values — semantic token contract 에 light 값을 주입 */
import {
  dimension,
  duration,
  easing,
  lightColor,
  motion,
  radius,
  spacing,
  typography,
} from '../tokens';
import type { ThemeValues } from '../theme.types';

/** light theme — green brand 기반 밝은 웹앱 스킴 */
export const light: ThemeValues = {
  color: lightColor,
  typography,
  dimension,
  spacing,
  radius,
  duration,
  easing,
  motion,
};
