import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { color } from './theme-contract.css';
import { tokens } from './tokens.css';

/**
 * RECIPES — multi-variant component styles. This is where MD3 component
 * specs (button types, card types, chip types) become typed, composable
 * classes. A recipe bundles a base style + named variants and returns one
 * class string for a chosen combination:
 *   button({ variant: 'filled', size: 'md' })
 *
 * State layers (hover/focus/pressed) are modeled with an ::before overlay
 * whose opacity comes from tokens.state.* — the MD3 "state layer" pattern.
 */

// Shared state-layer overlay used by every interactive surface.
const stateLayer = style({
  position: 'relative',
  isolation: 'isolate',
  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    background: 'currentColor',
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity ${tokens.motion.durationShort} ${tokens.motion.easingStandard}`,
  },
  selectors: {
    '&:hover::before': { opacity: tokens.state.hover },
    '&:focus-visible::before': { opacity: tokens.state.focus },
    '&:active::before': { opacity: tokens.state.pressed },
  },
});

export const button = recipe({
  base: [
    stateLayer,
    {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: 'none',
      borderRadius: tokens.shape.full,
      font: tokens.typescale.labelLarge,
      letterSpacing: '0.007em',
      cursor: 'pointer',
      height: '40px',
      paddingInline: '24px',
      whiteSpace: 'nowrap',
      transition: `box-shadow ${tokens.motion.durationShort} ${tokens.motion.easingStandard}`,
    },
  ],
  variants: {
    variant: {
      filled: { background: color.primary, color: color.onPrimary },
      tonal: { background: color.secondaryContainer, color: color.onSecondaryContainer },
      elevated: {
        background: color.surfaceContainerLow,
        color: color.primary,
        boxShadow: tokens.elevation.level1,
      },
      outlined: {
        background: 'transparent',
        color: color.primary,
        border: `1px solid ${color.outline}`,
      },
      text: { background: 'transparent', color: color.primary, paddingInline: '12px' },
    },
    size: {
      sm: { height: '32px', paddingInline: '16px' },
      md: {},
      lg: { height: '48px', paddingInline: '32px', font: tokens.typescale.titleMedium },
    },
  },
  defaultVariants: { variant: 'filled', size: 'md' },
});

export const card = recipe({
  base: {
    display: 'block',
    borderRadius: tokens.shape.medium,
    padding: '16px',
    color: color.onSurface,
    transition: `box-shadow ${tokens.motion.durationMedium} ${tokens.motion.easingStandard}`,
  },
  variants: {
    variant: {
      elevated: { background: color.surfaceContainerLow, boxShadow: tokens.elevation.level1 },
      filled: { background: color.surfaceContainerHighest },
      outlined: { background: color.surface, border: `1px solid ${color.outlineVariant}` },
    },
  },
  defaultVariants: { variant: 'elevated' },
});

export const chip = recipe({
  base: [
    stateLayer,
    {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      height: '32px',
      paddingInline: '16px',
      borderRadius: tokens.shape.small,
      font: tokens.typescale.labelLarge,
      cursor: 'pointer',
    },
  ],
  variants: {
    variant: {
      assist: { background: 'transparent', color: color.onSurface, border: `1px solid ${color.outline}` },
      filter: { background: 'transparent', color: color.onSurfaceVariant, border: `1px solid ${color.outline}` },
      input: { background: color.surfaceContainerHighest, color: color.onSurfaceVariant },
      suggestion: { background: 'transparent', color: color.onSurfaceVariant, border: `1px solid ${color.outline}` },
    },
    selected: { true: {}, false: {} },
  },
  compoundVariants: [
    {
      variants: { variant: 'filter', selected: true },
      style: { background: color.secondaryContainer, color: color.onSecondaryContainer, borderColor: 'transparent' },
    },
  ],
  defaultVariants: { variant: 'assist', selected: false },
});

export type ButtonVariants = Parameters<typeof button>[0];
export type CardVariants = Parameters<typeof card>[0];
export type ChipVariants = Parameters<typeof chip>[0];
