/** Label 기본 타이포 — 본문색·기본 굵기만, 추가 강조는 소비자 몫 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 폼 컨트롤 위 라벨 — 본문 색 + 기본 굵기 */
export const label = style([
  sprinkles({ display: 'inline-block' }),
  { color: vars.color.text, fontWeight: 500 },
]);
