/** CodePanel — 여러 줄 코드 블록과 복사 버튼 배치 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const panel = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12',
    p: '16',
    r: 'md',
  }),
  { border: `1px solid ${vars.color.border}`, background: vars.color.surface },
]);

/** 코드 블록 — @keyframes가 여러 줄이라 nowrap 대신 pre 그대로, 넘치면 스크롤 */
export const code = style({
  flexGrow: 1,
  margin: 0,
  overflowX: 'auto',
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  lineHeight: 1.6,
});
