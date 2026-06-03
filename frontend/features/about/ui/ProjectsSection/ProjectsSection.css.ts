import { bp } from '@/shared/styles/breakpoints';
import { card as cardRecipe } from '@/shared/styles/recipes.css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
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
  font: tokens.typescale.titleLarge,
  color: color.onSurface,
  margin: '0 0 1.5rem',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

// MD3 outlined 카드 — recipe(surface + outline-variant) + 프로젝트 카드 레이아웃 override
export const card = style([
  cardRecipe({ variant: 'outlined' }),
  {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
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

export const cardHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  '@media': {
    [bp.md]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '1rem',
    },
  },
});

export const name = style({
  font: tokens.typescale.titleMedium,
  fontWeight: 600,
  color: color.onSurface,
  margin: 0,
});

export const period = style({
  font: tokens.typescale.labelMedium,
  color: color.onSurfaceVariant,
  whiteSpace: 'nowrap',
});

export const description = style({
  font: tokens.typescale.bodyMedium,
  color: color.onSurfaceVariant,
  lineHeight: 1.6,
  margin: '0.25rem 0 0.5rem',
});

export const stackList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

// 디스플레이 전용 스택 칩 — MD3 input chip 톤
export const stackChip = style({
  font: tokens.typescale.labelLarge,
  color: color.onSurfaceVariant,
  background: color.surfaceContainerHighest,
  borderRadius: tokens.shape.small,
  height: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  paddingInline: '12px',
});

export const linkList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.25rem',
  listStyle: 'none',
  padding: 0,
  margin: '0.5rem 0 0',
});

// MD3 text 버튼 톤 링크 — primary 색 + hover state-layer
export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  font: tokens.typescale.labelLarge,
  color: color.primary,
  textDecoration: 'none',
  paddingInline: '12px',
  height: '36px',
  borderRadius: tokens.shape.full,
  background: 'transparent',
  transition: `background-color ${tokens.motion.durationShort} ${tokens.motion.easingStandard}`,
  ':hover': {
    background: `color-mix(in oklab, ${color.primary} 8%, transparent)`,
  },
  ':focus-visible': {
    outline: `2px solid ${color.primary}`,
    outlineOffset: '2px',
  },
});

export const linkArrow = style({
  display: 'inline-block',
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
});
