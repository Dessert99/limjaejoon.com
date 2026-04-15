import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const section = style({
  paddingTop: '2.5rem',
  paddingBottom: '2.5rem',
  '@media': {
    [bp.md]: {
      paddingTop: '3.5rem',
      paddingBottom: '3.5rem',
    },
  },
});

export const heading = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  margin: '0 0 1.5rem',
});

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: vars.fontSize.sm,
  color: vars.color.textPrimary,
  border: `1px solid ${vars.color.lineStrong}`,
  borderRadius: vars.radius.full,
  padding: '0.3rem 0.875rem',
  background: vars.color.bgSurface,
  transition:
    'color 150ms ease, border-color 150ms ease, background-color 150ms ease',
  ':hover': {
    color: vars.color.accentStrong,
    borderColor: vars.color.accentStrong,
    background: vars.color.accentSoft,
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const icon = style({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: vars.fontSize.base,
  lineHeight: 0,
});
