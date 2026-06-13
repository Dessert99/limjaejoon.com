import { bp } from '@/shared/styles/breakpoints';
import { card as cardRecipe } from '@/shared/styles/recipes.css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

export const main = style([
  sprinkles({
    display: 'flex',
    marginInline: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '80rem',
    paddingInline: '1rem',
    '@media': {
      [bp.md]: {
        paddingInline: '6rem',
      },
    },
  },
]);

// MD3 elevated 카드 recipe + 404 전용 레이아웃 override(composition).
// recipe import 후 정의되므로 padding override 가 결정적으로 적용된다.
export const card = style([
  cardRecipe({ variant: 'elevated' }),
  sprinkles({ padding: '32' }),
  {
    width: '100%',
    maxWidth: '36rem',
    textAlign: 'center',
  },
]);

export const label = style([
  sprinkles({ c: 'primary' }),
  {
    font: tokens.typescale.labelLarge,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
]);

export const heading = style([
  sprinkles({ marginTop: '12', c: 'onSurface' }),
  {
    font: tokens.typescale.headlineSmall,
  },
]);

export const body = style([
  sprinkles({ marginTop: '12', c: 'onSurfaceVariant' }),
  {
    font: tokens.typescale.bodyMedium,
  },
]);

export const homeLink = style([
  sprinkles({
    marginTop: '20',
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 'full',
    bg: 'secondaryContainer',
    c: 'onSecondaryContainer',
    paddingInline: '20',
    paddingBlock: '10',
  }),
  {
    font: tokens.typescale.labelLarge,
    textDecoration: 'none',
    transition: 'box-shadow 150ms ease',
    ':hover': {
      boxShadow: tokens.elevation.level1,
    },
  },
]);
