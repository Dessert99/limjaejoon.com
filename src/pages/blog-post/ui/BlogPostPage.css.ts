import { globalStyle, style } from '@vanilla-extract/css';
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
    maxWidth: '48rem',
    marginInline: 'auto',
  },
]);

export const header = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x3' }),
]);

export const backLink = style({
  color: vars.color.muted,
  fontSize: '0.875rem',
});

export const title = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1.1,
});

export const description = style({
  color: vars.color.muted,
  fontSize: '1.125rem',
});

export const meta = style([
  sprinkles({ display: 'flex', flexWrap: 'wrap', gap: 'x2' }),
  {
    color: vars.color.muted,
    fontSize: '0.875rem',
  },
]);

export const content = style({
  color: vars.color.text,
});

globalStyle(`${content} > * + *`, {
  marginTop: '1rem',
});

globalStyle(`${content} h1, ${content} h2, ${content} h3`, {
  lineHeight: 1.25,
});

globalStyle(`${content} code`, {
  fontFamily: vars.font.mono,
});

globalStyle(`${content} pre`, {
  overflowX: 'auto',
  padding: '1rem',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
});
