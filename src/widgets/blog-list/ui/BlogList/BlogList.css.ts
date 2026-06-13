import { sprinkles } from '@/shared/styles/sprinkles.css';
import { tokens } from '@/shared/styles/tokens.css';
import { style } from '@vanilla-extract/css';

// 컬러 커버 post-card 그리드 — 준정사각 카드가 폭에 맞춰 자동 채워진다
export const grid = style([
  sprinkles({
    display: 'grid',
    gap: '16',
  }),
  {
    gridTemplateColumns: 'repeat(auto-fill, minmax(236px, 1fr))',
  },
]);

export const emptyText = style([
  sprinkles({
    paddingTop: '32',
    c: 'onSurfaceVariant',
  }),
  {
    font: tokens.typescale.bodyMedium,
  },
]);
