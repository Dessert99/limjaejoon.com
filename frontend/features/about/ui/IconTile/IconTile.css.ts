import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

// 카드 + 라벨을 세로로 묶는 wrapper
export const tile = style({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
});

// 둥근 사각형 카드 — 호버 시 박스만 떠오름
export const card = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3rem',
  height: '3rem',
  borderRadius: tokens.shape.large,
  border: `1px solid ${color.outlineVariant}`,
  background: color.surfaceContainerLow,
  color: color.onSurfaceVariant,
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
});

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

export const label = style({
  font: tokens.typescale.bodyMedium,
  color: color.onSurfaceVariant,
});
