import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const grid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

export const emptyText = style({
  paddingTop: '2rem',
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});
