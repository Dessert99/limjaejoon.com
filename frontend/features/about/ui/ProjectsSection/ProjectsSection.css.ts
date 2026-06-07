import { bp } from '@/shared/styles/breakpoints';
import { card as cardRecipe } from '@/shared/styles/recipes.css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { color } from '@/shared/styles/theme-contract.css';
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

export const grid = style([
  sprinkles({
    display: 'grid',
    gap: '16',
    padding: 'none',
    margin: 'none',
  }),
  {
    gridTemplateColumns: '1fr',
    listStyle: 'none',
    '@media': {
      [bp.md]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      },
    },
  },
]);

// MD3 outlined 카드 — recipe(surface + outline-variant) + 프로젝트 카드 레이아웃 override
export const card = style([
  cardRecipe({ variant: 'outlined' }),
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '10',
  }),
  {
    padding: '1.125rem 1.25rem',
    height: '100%',
    transition: `border-color ${tokens.motion.durationShort} ${tokens.motion.easingStandard}, box-shadow ${tokens.motion.durationMedium} ${tokens.motion.easingStandard}, transform ${tokens.motion.durationMedium} ${tokens.motion.easingEmphasized}`,
    ':hover': {
      borderColor: color.outline,
      boxShadow: tokens.elevation.level2,
      transform: 'translateY(-2px)',
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
]);

export const cardHeader = sprinkles({
  display: 'flex',
  flexDirection: { mobile: 'column', tablet: 'row' },
  justifyContent: { tablet: 'space-between' },
  alignItems: { tablet: 'baseline' },
  gap: { mobile: '2', tablet: '16' },
});

export const name = style([
  sprinkles({
    c: 'onSurface',
    margin: 'none',
  }),
  {
    font: tokens.typescale.titleMedium,
    fontWeight: 600,
  },
]);

export const period = style([
  sprinkles({ c: 'onSurfaceVariant' }),
  {
    font: tokens.typescale.labelMedium,
    whiteSpace: 'nowrap',
  },
]);

export const description = style([
  sprinkles({
    c: 'onSurfaceVariant',
    marginTop: '4',
    marginInline: 'none',
    marginBottom: '8',
  }),
  {
    font: tokens.typescale.bodyMedium,
    lineHeight: 1.6,
  },
]);

export const stackList = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8',
    padding: 'none',
    margin: 'none',
  }),
  {
    listStyle: 'none',
  },
]);

// 디스플레이 전용 스택 칩 — MD3 input chip 톤
export const stackChip = style([
  sprinkles({
    c: 'onSurfaceVariant',
    bg: 'surfaceContainerHighest',
    borderRadius: 'small',
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: '12',
  }),
  {
    font: tokens.typescale.labelLarge,
    height: '32px',
  },
]);

export const linkList = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4',
    padding: 'none',
    marginTop: '8',
    marginInline: 'none',
    marginBottom: 'none',
  }),
  {
    listStyle: 'none',
  },
]);

// MD3 text 버튼 톤 링크 — primary 색 + hover state-layer
export const link = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4',
    c: 'primary',
    paddingInline: '12',
    borderRadius: 'full',
  }),
  {
    font: tokens.typescale.labelLarge,
    textDecoration: 'none',
    height: '36px',
    background: 'transparent',
    transition: `background-color ${tokens.motion.durationShort} ${tokens.motion.easingStandard}`,
    ':hover': {
      background: `color-mix(in oklab, ${color.primary} 8%, transparent)`,
    },
    ':focus-visible': {
      outline: `2px solid ${color.primary}`,
      outlineOffset: '2px',
    },
  },
]);

export const linkArrow = style([
  sprinkles({ display: 'inline-block' }),
  {
    transition: 'transform 200ms ease',
    selectors: {
      [`${link}:hover &`]: {
        transform: 'translateX(2px)',
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
]);
