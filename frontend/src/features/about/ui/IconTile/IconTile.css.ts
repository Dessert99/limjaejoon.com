import { sprinkles } from '@/shared/styles/sprinkles.css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

// 카드 + 라벨을 세로로 묶는 wrapper
export const tile = sprinkles({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8',
});

// 둥근 사각형 카드 — 호버 시 박스만 떠오름
export const card = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'large',
    bg: 'surfaceContainerLow',
    c: 'onSurfaceVariant',
  }),
  {
    width: '3rem',
    height: '3rem',
    border: `1px solid ${color.outlineVariant}`,
    fontSize: '1.25rem',
    boxShadow: tokens.elevation.level1,
    textDecoration: 'none',
    transition:
      'color 200ms ease, border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease',
    ':hover': {
      color: color.primary,
      borderColor: color.primary,
      transform: 'translateY(-4px)',
      boxShadow: tokens.elevation.level3,
    },
    ':focus-visible': {
      outline: `2px solid ${color.primary}`,
      outlineOffset: '2px',
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
]);

// 카드(card) hover 시 자식 아이콘만 회전 — selectors로 부모 상태 참조
export const icon = style({
  transition: 'transform 200ms ease',
  selectors: {
    [`${card}:hover &`]: {
      transform: 'rotate(-12deg) scale(1.08)',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const label = style([
  sprinkles({ c: 'onSurfaceVariant' }),
  {
    font: tokens.typescale.bodyMedium,
  },
]);
