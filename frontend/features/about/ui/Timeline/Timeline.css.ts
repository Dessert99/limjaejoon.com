import { bp } from '@/shared/styles/breakpoints';
import { card as cardRecipe } from '@/shared/styles/recipes.css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { keyframes, style } from '@vanilla-extract/css';

const pulse = keyframes({
  '0%': {
    boxShadow: `0 0 0 0 color-mix(in oklab, ${color.primary} 50%, transparent), 0 0 0 3px ${color.background}`,
  },
  '70%': {
    boxShadow: `0 0 0 8px color-mix(in oklab, ${color.primary} 0%, transparent), 0 0 0 3px ${color.background}`,
  },
  '100%': {
    boxShadow: `0 0 0 0 color-mix(in oklab, ${color.primary} 0%, transparent), 0 0 0 3px ${color.background}`,
  },
});

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

export const list = style({
  position: 'relative',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  paddingLeft: '1.5rem',
  '::before': {
    content: '""',
    position: 'absolute',
    top: '0.5rem',
    bottom: '0.5rem',
    left: '0.3125rem',
    width: '2px',
    background: color.outlineVariant,
    borderRadius: tokens.shape.full,
  },
  '::after': {
    content: '""',
    position: 'absolute',
    top: '0.5rem',
    left: '0.3125rem',
    width: '2px',
    height: 'calc(100% - 1.5rem)',
    background: `linear-gradient(180deg, ${color.primary}, color-mix(in oklab, ${color.primary} 30%, transparent))`,
    borderRadius: tokens.shape.full,
    WebkitMaskImage: 'linear-gradient(180deg, #000 0 60%, transparent 100%)',
    maskImage: 'linear-gradient(180deg, #000 0 60%, transparent 100%)',
  },
});

export const item = style({
  position: 'relative',
  paddingBottom: '1.5rem',
  selectors: {
    '&:last-child': {
      paddingBottom: 0,
    },
  },
});

export const marker = style({
  position: 'absolute',
  left: '-1.4375rem',
  top: '0.4375rem',
  width: '0.75rem',
  height: '0.75rem',
  borderRadius: tokens.shape.full,
  background: color.primary,
  boxShadow: `0 0 0 3px ${color.background}`,
  transition: 'transform 150ms ease',

  selectors: {
    [`${item}:first-child &`]: {
      animation: `${pulse} 2.2s ease-out infinite`,
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: {
        [`${item}:first-child &`]: {
          animation: 'none',
        },
      },
    },
  },
});

// MD3 outlined 카드 — recipe(surface + outline-variant) + 타임라인 카드 레이아웃 override
export const card = style([
  cardRecipe({ variant: 'outlined' }),
  {
    padding: '1rem 1.25rem',
    transition: `border-color ${tokens.motion.durationShort} ${tokens.motion.easingStandard}, box-shadow ${tokens.motion.durationMedium} ${tokens.motion.easingStandard}`,
    ':hover': {
      borderColor: color.outline,
      boxShadow: tokens.elevation.level1,
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

export const title = style({
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

export const subtitle = style({
  font: tokens.typescale.bodyMedium,
  color: color.onSurfaceVariant,
  marginTop: '0.25rem',
});

export const description = style({
  font: tokens.typescale.bodyMedium,
  color: color.onSurfaceVariant,
  lineHeight: 1.6,
  marginTop: '0.625rem',
  whiteSpace: 'pre-line',
});

export const stackList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  listStyle: 'none',
  padding: 0,
  margin: '0.75rem 0 0',
});

// 디스플레이 전용 스택 칩 — MD3 input chip 톤(surface-container-highest)
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
