import { style } from '@vanilla-extract/css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';

export const main = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '32',
    px: { mobile: '20', tablet: '40' },
    py: '64',
  }),
  {
    width: '100%',
    maxWidth: '56rem',
    marginInline: 'auto',
  },
]);

export const header = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: '8' }),
]);

export const eyebrow = style({
  color: vars.color.muted,
  fontSize: '0.875rem',
});

export const title = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1.1,
});

export const list = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: '16' }),
]);

export const item = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '8',
    p: '20',
    r: 'md',
  }),
  {
    border: `1px solid ${vars.color.border}`,
    background: vars.color.surface,
  },
]);

export const itemTitle = style({
  fontSize: '1.25rem',
  lineHeight: 1.3,
});

export const description = style({
  color: vars.color.muted,
});

export const meta = style([
  sprinkles({ display: 'flex', flexWrap: 'wrap', gap: '8' }),
  {
    color: vars.color.muted,
    fontSize: '0.875rem',
  },
]);
