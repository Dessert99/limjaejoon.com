import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { bp } from '@/styles/breakpoints';

// 모바일 1열 → md 2열 → lg 3열로 카드 그리드 분기
export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    [bp.lg]: {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
});

export const emptyText = style({
  paddingTop: '2rem',
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});
