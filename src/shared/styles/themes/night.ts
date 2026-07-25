/** dark theme values — semantic token contract 에 dark 값을 주입 */
import {
  container,
  darkColor,
  dimension,
  duration,
  easing,
  motion,
  radius,
  spacing,
  typography,
} from '../tokens';
import type { ThemeValues } from '../theme.types';

/** dark theme — data-theme 없이 적용되는 기본 웹앱 스킴 */
export const night: ThemeValues = {
  color: darkColor,
  typography,
  dimension,
  spacing,
  container,
  radius,
  duration,
  easing,
  motion,
};
