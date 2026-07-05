/** 라이트 테마 색 값 — base 의 공통값 위에 라이트 팔레트를 얹는다 */
import type { ThemeValues } from '../theme.types';
import { font, radius } from './base';

/** 쨍하게 밝은 대낮 — accent=꿀빛 골드 */
export const light: ThemeValues = {
  color: {
    background: '#eef4fb',
    surface: '#ffffff',
    text: '#1c2630',
    muted: '#5d6b7a',
    border: '#d8e2ee',
    overlay: 'rgba(28, 38, 48, 0.45)',
    accent: '#c79338',
    accentForeground: '#1c2630',
  },
  font,
  radius,
};
