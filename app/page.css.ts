import { style } from '@vanilla-extract/css';
import { bp } from '@/styles/breakpoints';

export const main = style({
  minHeight: '100vh',
  width: '100%',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingTop: '7rem',
  paddingBottom: '6rem',
  '@media': {
    [bp.md]: {
      paddingLeft: '2rem',
      paddingRight: '2rem',
    },
  },
});
