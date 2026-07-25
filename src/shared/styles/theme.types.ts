/** 테마 시스템 타입 — theme.css contract 와 semantic token 값이 공유하는 모양 계약 */
import type { SemanticColor } from './tokens';
import type {
  dimension,
  spacing,
  container,
  typography,
  radius,
  duration,
  easing,
  motion,
} from './tokens';

/** 토큰 컨트랙트와 같은 모양의 값 — theme.css 의 vars 와 1:1 대응 */
export interface ThemeValues {
  color: SemanticColor;
  typography: typeof typography;
  dimension: typeof dimension;
  spacing: typeof spacing;
  container: typeof container;
  radius: typeof radius;
  duration: typeof duration;
  easing: typeof easing;
  motion: typeof motion;
}
