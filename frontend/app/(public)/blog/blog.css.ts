import { bp } from '@/shared/styles/breakpoints';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

export const main = style({
  margin: '0 auto',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '80rem',
  paddingInline: '1rem',
  paddingBottom: '4rem',
  '@media': {
    [bp.md]: {
      paddingInline: '3rem',
    },
  },
});

export const header = style({
  marginBottom: '2rem',
  paddingBottom: '1.5rem',
  borderBottom: `1px solid ${color.outlineVariant}`,
});

export const heading = style({
  font: tokens.typescale.headlineMedium,
  color: color.onSurface,
  letterSpacing: '-0.01em',
  '@media': {
    [bp.md]: {
      font: tokens.typescale.displaySmall,
    },
  },
});

export const description = style({
  marginTop: '0.5rem',
  font: tokens.typescale.bodyLarge,
  color: color.onSurfaceVariant,
});

// 검색창 영역 — 헤더와 태그/리스트 그리드 사이 간격
export const searchWrap = style({
  marginBottom: '1.5rem',
});

export const layout = style({
  display: 'grid',
  gap: '1.5rem',
  '@media': {
    [bp.md]: {
      gridTemplateColumns: '9rem 1fr',
      alignItems: 'start',
    },
  },
});
