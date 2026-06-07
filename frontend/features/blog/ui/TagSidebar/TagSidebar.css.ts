import { bp } from '@/shared/styles/breakpoints';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

// 태그 필터 — 칩 자체는 shared/ui/Chip(recipes.chip). 여기서는 배치만 담당.
export const sidebar = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '6',
    alignItems: 'center',
  }),
  {
    '@media': {
      [bp.md]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.375rem',
        position: 'sticky',
        top: '5rem',
      },
    },
  },
]);

export const label = style([
  sprinkles({
    display: { mobile: 'none', tablet: 'block' },
    c: 'onSurfaceVariant',
    marginBottom: '8',
  }),
  {
    font: tokens.typescale.labelMedium,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
]);

export const list = style([
  sprinkles({
    padding: 'none',
    margin: 'none',
    display: { mobile: 'contents', tablet: 'flex' }, // 모바일: 칩들을 sidebar flex에 직접 흘려보냄
    flexDirection: { tablet: 'column' },
    alignItems: { tablet: 'flex-start' },
    gap: { tablet: '6' },
  }),
  {
    listStyle: 'none',
  },
]);
