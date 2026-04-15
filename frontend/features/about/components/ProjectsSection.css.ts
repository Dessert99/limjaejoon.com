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

export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.lg,
  background: vars.color.bgSurface,
  boxShadow: vars.shadow.cardSm,
  padding: '1.125rem 1.25rem',
  transition:
    'transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
  ':hover': {
    transform: 'translateY(-2px)',
    borderColor: vars.color.accentStrong,
    boxShadow: vars.shadow.cardMd,
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const cardHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  '@media': {
    [bp.md]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '1rem',
    },
  },
});

export const name = style({
  fontSize: vars.fontSize.lg,
  fontWeight: 600,
  color: vars.color.textPrimary,
  margin: 0,
});

export const period = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

export const description = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  lineHeight: 1.6,
  margin: 0,
});

export const stackList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.375rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const stackChip = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textSecondary,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.full,
  padding: '0.125rem 0.5rem',
  background: vars.color.bgSoft,
});

export const linkList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  listStyle: 'none',
  padding: 0,
  margin: '0.25rem 0 0',
});

export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: vars.fontSize.sm,
  color: vars.color.accentStrong,
  textDecoration: 'none',
  padding: '0.25rem 0.625rem',
  border: `1px solid ${vars.color.accentStrong}`,
  borderRadius: vars.radius.full,
  transition:
    'color 150ms ease, background-color 150ms ease, border-color 150ms ease',
  ':hover': {
    background: vars.color.accentSoft,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentStrong}`,
    outlineOffset: '2px',
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
