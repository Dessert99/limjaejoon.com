import { bp } from '@/shared/styles/breakpoints';
import { card as cardRecipe } from '@/shared/styles/recipes.css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
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
    padding: 'none',
    margin: 'none',
    paddingLeft: '24',
  }),
  {
    position: 'relative',
    listStyle: 'none',
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
  },
]);

export const item = style([
  sprinkles({ paddingBottom: '24' }),
  {
    position: 'relative',
    selectors: {
      '&:last-child': {
        paddingBottom: 0,
      },
    },
  },
]);

export const marker = style([
  sprinkles({
    borderRadius: 'full',
    bg: 'primary',
  }),
  {
    position: 'absolute',
    left: '-1.4375rem',
    top: '0.4375rem',
    width: '0.75rem',
    height: '0.75rem',
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
  },
]);

// MD3 outlined 카드 — recipe(surface + outline-variant) + 타임라인 카드 레이아웃 override
export const card = style([
  cardRecipe({ variant: 'outlined' }),
  sprinkles({
    paddingBlock: '16',
    paddingInline: '20',
  }),
  {
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

export const cardHeader = sprinkles({
  display: 'flex',
  flexDirection: { mobile: 'column', tablet: 'row' },
  justifyContent: { tablet: 'space-between' },
  alignItems: { tablet: 'baseline' },
  gap: { mobile: '2', tablet: '16' },
});

export const title = style([
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

export const subtitle = style([
  sprinkles({
    c: 'onSurfaceVariant',
    marginTop: '4',
  }),
  {
    font: tokens.typescale.bodyMedium,
  },
]);

export const description = style([
  sprinkles({
    c: 'onSurfaceVariant',
    marginTop: '10',
  }),
  {
    font: tokens.typescale.bodyMedium,
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
  },
]);

export const stackList = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8',
    padding: 'none',
    marginTop: '12',
    marginInline: 'none',
    marginBottom: 'none',
  }),
  {
    listStyle: 'none',
  },
]);

// 디스플레이 전용 스택 칩 — MD3 input chip 톤(surface-container-highest)
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
