/** RadioGroup 묶음·원·점 — 선택 시 accent 점 표시 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 세로 묶음 — 항목 간격만 */
export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x2' }),
]);

/** 항목 원 — 1.25rem, 선택되면 테두리 accent */
export const item = style({
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '9999px',
  border: `1px solid ${vars.color.stroke.neutral}`,
  background: vars.color.bg.canvas,
  cursor: 'pointer',
  selectors: {
    '&[data-state="checked"]': { borderColor: vars.color.stroke.brand },
  },
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
});

/** 선택 점 — Indicator가 마운트될 때만 보임 */
export const indicator = style({
  display: 'inline-flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  '::after': {
    content: '""',
    display: 'block',
    width: '0.625rem',
    height: '0.625rem',
    borderRadius: '9999px',
    background: vars.color.bg.brand,
  },
});
