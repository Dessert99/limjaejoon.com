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
    maxWidth: vars.container.prose,
    marginInline: 'auto',
  },
]);

export const header = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x3' }),
]);

export const backLink = style({
  color: vars.color.fg.muted,
  fontSize: vars.typography.fontSize[14],
});

export const title = style({
  fontSize: vars.typography.fontSize[40],
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1.1,
});

export const description = style({
  color: vars.color.fg.muted,
  fontSize: vars.typography.fontSize[20],
});

export const meta = style([
  sprinkles({ display: 'flex', flexWrap: 'wrap', gap: 'x2' }),
  {
    color: vars.color.fg.muted,
    fontSize: vars.typography.fontSize[14],
  },
]);

export const content = style({
  marginTop: vars.dimension.x8,
});
