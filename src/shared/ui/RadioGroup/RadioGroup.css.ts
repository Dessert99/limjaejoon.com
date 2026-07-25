/** RadioGroup 묶음·원·점 — 선택 시 accent 점 표시 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 세로 묶음 — 항목 간격만 */
export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x2' }),
]);

/** 항목 원 — 1.25rem, 선택되면 테두리 accent, 선택 순간 미세 scale(no-preference 게이트) */
export const item = style({
  width: vars.dimension.x5,
  height: vars.dimension.x5,
  flexShrink: 0,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.stroke.neutral}`,
  background: vars.color.bg.canvas,
  cursor: 'pointer',
  selectors: {
    '&[data-state="checked"]': { borderColor: vars.color.stroke.brand },
  },
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      transition: `transform ${vars.motion.tactileLift.duration} ${vars.motion.tactileLift.easing}`,
      selectors: {
        '&[data-state="checked"]': { transform: 'scale(1.08)' },
      },
    },
  },
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
    width: vars.dimension.x2_5,
    height: vars.dimension.x2_5,
    borderRadius: vars.radius.pill,
    background: vars.color.bg.brand,
  },
});
