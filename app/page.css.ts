import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const main = style({
  minHeight: '100vh',
  width: '100%',
  paddingLeft: vars.spacing.pagePadMobile,
  paddingRight: vars.spacing.pagePadMobile,
  '@media': {
    [bp.md]: {
      paddingLeft: vars.spacing.pagePad,
      paddingRight: vars.spacing.pagePad,
    },
  },
});
