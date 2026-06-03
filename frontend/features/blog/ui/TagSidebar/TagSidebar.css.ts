import { bp } from '@/shared/styles/breakpoints';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

// 태그 필터 — 칩 자체는 shared/ui/Chip(recipes.chip). 여기서는 배치만 담당.
export const sidebar = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '0.375rem',
  alignItems: 'center',
  '@media': {
    [bp.md]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.375rem',
      position: 'sticky',
      top: '5rem',
    },
  },
});

export const label = style({
  display: 'none',
  font: tokens.typescale.labelMedium,
  color: color.onSurfaceVariant,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '0.5rem',
  '@media': {
    [bp.md]: {
      display: 'block',
    },
  },
});

export const list = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'contents', // 모바일: 칩들을 sidebar flex에 직접 흘려보냄
  '@media': {
    [bp.md]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.375rem',
    },
  },
});
