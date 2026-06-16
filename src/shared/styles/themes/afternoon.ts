/** 오후 테마 색 값 — base 의 공통값 위에 오후 팔레트를 얹는다 */
import type { ThemeValues } from '../theme.types';
import { font, radius } from './base';

/** 쩅하게 밝은 대낮(라이트) — accent=꿀빛 골드 */
export const afternoon: ThemeValues = {
  color: {
    background: '#eef4fb',
    surface: '#ffffff',
    text: '#1c2630',
    muted: '#5d6b7a',
    border: '#d8e2ee',
    accent: '#c79338',
    accentForeground: '#1c2630',
  },
  font,
  radius,
};
