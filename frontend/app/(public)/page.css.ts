import { bp } from '@/shared/styles/breakpoints';
import { style } from '@vanilla-extract/css';

export const main = style({
  minHeight: '100vh',
  width: '100%',
  maxWidth: '60rem',
  marginInline: 'auto',
  paddingInline: '1rem',
  paddingBottom: '4rem',
  '@media': {
    [bp.md]: {
      paddingInline: '6rem',
    },
  },
});
