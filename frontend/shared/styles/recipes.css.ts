import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { color } from './theme-contract.css';
import { tokens } from './tokens.css';

// RECIPES — 다변형 컴포넌트 스타일. MD3 컴포넌트 스펙(버튼 5종, 카드 3종, 칩 4종)을
// 타입 안전한 조합 클래스로 만든다: button({ variant: 'filled', size: 'md' }).
// state layer(hover/focus/pressed)는 ::before 오버레이 + tokens.state.* 불투명도로 표현.

// 모든 인터랙티브 표면이 공유하는 state-layer 오버레이.
export const stateLayer = style({
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
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      '::before': { transition: 'none' },
    },
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
      textDecoration: 'none',
      transition: `box-shadow ${tokens.motion.durationShort} ${tokens.motion.easingStandard}`,
    },
  ],
  variants: {
    variant: {
      filled: { background: color.primary, color: color.onPrimary },
      tonal: {
        background: color.secondaryContainer,
        color: color.onSecondaryContainer,
      },
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
      text: {
        background: 'transparent',
        color: color.primary,
        paddingInline: '12px',
      },
    },
    size: {
      sm: { height: '32px', paddingInline: '16px' },
      md: {},
      lg: {
        height: '48px',
        paddingInline: '32px',
        font: tokens.typescale.titleMedium,
      },
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
      elevated: {
        background: color.surfaceContainerLow,
        boxShadow: tokens.elevation.level1,
      },
      filled: { background: color.surfaceContainerHighest },
      outlined: {
        background: color.surface,
        border: `1px solid ${color.outlineVariant}`,
      },
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
      whiteSpace: 'nowrap',
    },
  ],
  variants: {
    variant: {
      assist: {
        background: 'transparent',
        color: color.onSurface,
        border: `1px solid ${color.outline}`,
      },
      filter: {
        background: 'transparent',
        color: color.onSurfaceVariant,
        border: `1px solid ${color.outline}`,
      },
      input: {
        background: color.surfaceContainerHighest,
        color: color.onSurfaceVariant,
      },
      suggestion: {
        background: 'transparent',
        color: color.onSurfaceVariant,
        border: `1px solid ${color.outline}`,
      },
    },
    selected: { true: {}, false: {} },
  },
  compoundVariants: [
    {
      variants: { variant: 'filter', selected: true },
      style: {
        background: color.secondaryContainer,
        color: color.onSecondaryContainer,
        borderColor: 'transparent',
      },
    },
  ],
  defaultVariants: { variant: 'assist', selected: false },
});

export type ButtonVariants = Parameters<typeof button>[0];
export type CardVariants = Parameters<typeof card>[0];
export type ChipVariants = Parameters<typeof chip>[0];
