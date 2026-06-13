import { bp } from '@/shared/styles/breakpoints';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

export const section = style([
  sprinkles({
    paddingTop: '40',
    paddingBottom: '40',
  }),
  {
    '@media': {
      [bp.md]: {
        paddingTop: '3.5rem',
        paddingBottom: '3.5rem',
      },
    },
  },
]);

export const heading = style([
  sprinkles({
    c: 'onSurface',
    marginTop: 'none',
    marginInline: 'none',
    marginBottom: '24',
  }),
  {
    font: tokens.typescale.titleLarge,
  },
]);

export const list = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16',
    padding: 'none',
    margin: 'none',
  }),
  {
    listStyle: 'none',
  },
]);
