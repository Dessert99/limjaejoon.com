/** 노을 테마 색 값 — base 의 공통값 위에 노을 팔레트를 얹는다 */
import type { ThemeValues } from '../theme.types';
import { font, radius } from './base';

/** 저녁 6~7시 웜 더스크 — accent=잉걸불 */
export const sunset: ThemeValues = {
  color: {
    background: '#2c2030',
    surface: '#3a2b3c',
    text: '#f6e7d6',
    muted: '#c2a18d',
    border: '#4f3b49',
    accent: '#e07a45',
    accentForeground: '#2c2030',
  },
  font,
  radius,
};
