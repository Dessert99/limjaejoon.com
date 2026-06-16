/** 새벽 테마 색 값 — base 의 공통값 위에 새벽 팔레트를 얹는다 */
import type { ThemeValues } from '../theme.types';
import { font, radius } from './base';

/** 남보라 트와일라잇 — accent=옅은 장미 */
export const dawn: ThemeValues = {
  color: {
    background: '#1b2038',
    surface: '#262b46',
    text: '#e9eaf6',
    muted: '#a3a8cb',
    border: '#353b59',
    accent: '#cf8f86',
    accentForeground: '#1b2038',
  },
  font,
  radius,
};
