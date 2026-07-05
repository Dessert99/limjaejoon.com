/** CodePanel — 코드 블록과 복사 버튼 배치 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const panel = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '12',
    p: '16',
    r: 'md',
  }),
  { border: `1px solid ${vars.color.border}`, background: vars.color.surface },
]);

/** 코드 블록 — 조작 중 값이 길어져도 줄바꿈 없이 스크롤 */
export const code = style({
  flexGrow: 1,
  margin: 0,
  overflowX: 'auto',
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
});
