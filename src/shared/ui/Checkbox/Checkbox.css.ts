/** Checkbox 박스·체크 — checked/indeterminate면 accent로 채움 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 박스 — 1.25rem 정사각, 체크 표시는 accentForeground 색으로 */
export const root = style({
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: vars.radius.r1,
  border: `1px solid ${vars.color.stroke.neutral}`,
  background: vars.color.bg.canvas,
  color: vars.color.fg.onBrand,
  cursor: 'pointer',
  selectors: {
    '&[data-state="checked"], &[data-state="indeterminate"]': {
      background: vars.color.bg.brand,
      borderColor: vars.color.stroke.brand,
    },
  },
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
});

/** 체크/대시 — checked·indeterminate일 때만 Radix가 마운트 */
export const indicator = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  lineHeight: 1,
  color: 'currentColor',
});
