import { style } from '@vanilla-extract/css';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';

// 컬러 커버 post-card 그리드 — 준정사각 카드가 폭에 맞춰 자동 채워진다
export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(236px, 1fr))',
  gap: '16px',
});

export const emptyText = style({
  paddingTop: '2rem',
  font: tokens.typescale.bodyMedium,
  color: color.onSurfaceVariant,
});
