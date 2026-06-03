import { bp } from '@/shared/styles/breakpoints';
import { card as cardRecipe } from '@/shared/styles/recipes.css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

export const main = style({
  margin: '0 auto',
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '80rem',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInline: '1rem',
  '@media': {
    [bp.md]: {
      paddingInline: '6rem',
    },
  },
});

// MD3 elevated 카드 recipe + 404 전용 레이아웃 override(composition).
// recipe import 후 정의되므로 padding override 가 결정적으로 적용된다.
export const card = style([
  cardRecipe({ variant: 'elevated' }),
  {
    width: '100%',
    maxWidth: '36rem',
    padding: '2rem',
    textAlign: 'center',
  },
]);

export const label = style({
  font: tokens.typescale.labelLarge,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: color.primary,
});

export const heading = style({
  marginTop: '0.75rem',
  font: tokens.typescale.headlineSmall,
  color: color.onSurface,
});

export const body = style({
  marginTop: '0.75rem',
  font: tokens.typescale.bodyMedium,
  color: color.onSurfaceVariant,
});

export const homeLink = style({
  marginTop: '1.25rem',
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: tokens.shape.full,
  background: color.secondaryContainer,
  color: color.onSecondaryContainer,
  paddingInline: '1.25rem',
  paddingBlock: '0.625rem',
  font: tokens.typescale.labelLarge,
  textDecoration: 'none',
  transition: 'box-shadow 150ms ease',
  ':hover': {
    boxShadow: tokens.elevation.level1,
  },
});
