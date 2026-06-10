import { bp } from '@/shared/styles/breakpoints';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

export const main = style([
  sprinkles({
    marginInline: 'auto',
    paddingInline: { mobile: '16', tablet: '48' },
    paddingBottom: '64',
  }),
  {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '80rem',
  },
]);

export const header = style([
  sprinkles({ marginBottom: '32', paddingBottom: '24' }),
  {
    borderBottom: `1px solid ${color.outlineVariant}`,
  },
]);

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

export const description = style([
  sprinkles({ marginTop: '8' }),
  {
    font: tokens.typescale.bodyLarge,
    color: color.onSurfaceVariant,
  },
]);

// 검색창 영역 — 헤더와 태그/리스트 그리드 사이 간격
export const searchWrap = sprinkles({ marginBottom: '24' });

export const layout = style([
  sprinkles({ display: 'grid', gap: '24' }),
  {
    '@media': {
      [bp.md]: {
        gridTemplateColumns: '9rem 1fr',
        alignItems: 'start',
      },
    },
  },
]);
