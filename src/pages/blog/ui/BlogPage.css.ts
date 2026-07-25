import { style } from '@vanilla-extract/css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';

export const main = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x8',
    px: { mobile: 'x5', tablet: 'x10' },
    py: 'x16',
  }),
  {
    width: '100%',
    maxWidth: vars.container.page,
    marginInline: 'auto',
  },
]);

export const header = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x2' }),
]);

export const eyebrow = style({
  color: vars.color.fg.muted,
  fontSize: vars.typography.fontSize[14],
});

export const title = style({
  fontSize: vars.typography.fontSize[40],
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1.1,
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
  {
    border: `1px solid ${vars.color.stroke.neutral}`,
    background: vars.color.bg.surface,
  },
]);

export const itemTitle = style({
  fontSize: vars.typography.fontSize[20],
  lineHeight: 1.3,
});

export const description = style({
  color: vars.color.fg.muted,
});

export const meta = style([
  sprinkles({ display: 'flex', flexWrap: 'wrap', gap: 'x2' }),
  {
    color: vars.color.fg.muted,
    fontSize: vars.typography.fontSize[14],
  },
]);

export const empty = style({
  padding: vars.dimension.x6,
  border: `1px solid ${vars.color.stroke.neutral}`,
  borderRadius: vars.radius.r2,
  color: vars.color.fg.muted,
  textAlign: 'center',
});
