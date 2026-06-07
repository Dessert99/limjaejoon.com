import { bp } from '@/shared/styles/breakpoints';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const main = style([
  sprinkles({ marginInline: 'auto', paddingBottom: '64' }),
  {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '60rem',
    paddingInline: '1rem',
    '@media': {
      [bp.md]: {
        paddingInline: '6rem',
      },
    },
  },
]);
