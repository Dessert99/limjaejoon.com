import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const marker = style({
  width: '3rem',
  height: '0.25rem',
  borderRadius: vars.radius.sm,
  background: vars.color.accent,
  opacity: 0.4,
});
