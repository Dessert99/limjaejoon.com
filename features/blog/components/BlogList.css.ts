import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { bp } from '@/styles/breakpoints';

export const grid = style({
  display: 'grid',
  gap: '1.25rem',
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [bp.xl]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});

export const emptyText = style({
  paddingTop: '2rem',
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});
