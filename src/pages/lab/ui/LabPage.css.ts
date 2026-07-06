/** LabPage — 목록 페이지 배치, BlogPage와 같은 리듬 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const main = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x8',
    px: { mobile: 'x5', tablet: 'x10' },
    py: 'x16',
  }),
  { width: '100%', maxWidth: '56rem', marginInline: 'auto' },
]);

export const header = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x2' }),
]);

export const eyebrow = style({
  color: vars.color.muted,
  fontSize: '0.875rem',
});

export const title = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  lineHeight: 1.1,
});

export const description = style({
  color: vars.color.muted,
  lineHeight: 1.7,
});

export const list = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x4' }),
]);

export const item = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x2',
    p: 'x5',
    r: 'r2',
  }),
  { border: `1px solid ${vars.color.border}`, background: vars.color.surface },
]);

export const itemTitle = style({
  fontSize: '1.25rem',
  fontFamily: 'monospace',
  lineHeight: 1.3,
});

export const itemDescription = style({
  color: vars.color.muted,
});
