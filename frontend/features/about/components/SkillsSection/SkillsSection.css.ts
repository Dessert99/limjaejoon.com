import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const section = style({
  paddingTop: '2.5rem',
  paddingBottom: '2.5rem',
  '@media': {
    [bp.md]: {
      paddingTop: '3.5rem',
      paddingBottom: '3.5rem',
    },
  },
});

export const heading = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  margin: '0 0 1.5rem',
});

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});
