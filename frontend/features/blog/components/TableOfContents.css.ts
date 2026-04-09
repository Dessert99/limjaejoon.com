import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const nav = style({
  display: 'none',
  '@media': {
    [bp.lg]: {
      display: 'block',
      position: 'sticky',
      top: '10rem',
      maxHeight: 'calc(100vh - 6rem)',
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      borderLeft: `1px solid ${vars.color.lineSoft}`,
      paddingLeft: '0.75rem',
    },
  },
});

export const title = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 600,
  color: vars.color.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '0.75rem',
});

export const list = style({
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const link = style({
  display: 'block',
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  textDecoration: 'none',
  paddingBlock: '0.2rem',
  paddingLeft: '0',
  borderLeft: '2px solid transparent',
  marginLeft: '-0.8125rem',
  paddingInlineStart: '0.625rem',
  transition: 'color 150ms ease, border-color 150ms ease',
  ':hover': {
    color: vars.color.textPrimary,
  },
  ':focus-visible': {
    color: vars.color.textPrimary,
    borderLeftColor: vars.color.accentStrong,
  },
  selectors: {
    '&[data-active="true"]': {
      color: vars.color.accentStrong,
      borderLeftColor: vars.color.accentStrong,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
