/** Progress 트랙·막대 — 막대는 value/max 비율만큼 채움 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 트랙 — text 10% 틴트로 4테마 공통 은은한 배경 */
export const root = style({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '0.5rem',
  borderRadius: '9999px',
  background: `color-mix(in srgb, ${vars.color.text} 10%, transparent)`,
});

/** 채움 막대 — 너비 100%를 두고 translateX로 비율만큼만 노출 */
export const indicator = style({
  width: '100%',
  height: '100%',
  background: vars.color.accent,
  transition: 'transform 200ms ease',
});
