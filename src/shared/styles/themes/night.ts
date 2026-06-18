/** 밤 테마 색 값 — base 의 공통값 위에 밤 팔레트를 얹는다 */
import type { ThemeValues } from '../theme.types';
import { font, radius } from './base';

/** 10시 이후 검은색에 가까운 차가운 밤 — accent=달빛 아이보리 */
export const night: ThemeValues = {
  color: {
    background: '#0a0b10',
    surface: '#14161e',
    text: '#e7eaf3',
    muted: '#8a93ac',
    border: '#232838',
    overlay: 'rgba(0, 0, 0, 0.65)',
    accent: '#d8c39a',
    accentForeground: '#14161e',
  },
  font,
  radius,
};
