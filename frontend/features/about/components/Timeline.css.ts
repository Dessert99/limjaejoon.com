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
  position: 'relative',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  paddingLeft: '1.5rem',
  '::before': {
    content: '""',
    position: 'absolute',
    top: '0.5rem',
    bottom: '0.5rem',
    left: '0.3125rem',
    width: '2px',
    background: vars.color.lineSoft,
    borderRadius: vars.radius.full,
  },
});

export const item = style({
  position: 'relative',
  paddingBottom: '1.5rem',
  selectors: {
    '&:last-child': {
      paddingBottom: 0,
    },
  },
});

export const marker = style({
  position: 'absolute',
  left: '-1.4375rem',
  top: '0.4375rem',
  width: '0.75rem',
  height: '0.75rem',
  borderRadius: vars.radius.full,
  background: vars.color.accentStrong,
  boxShadow: `0 0 0 3px ${vars.color.bgPage}`,
  transition: 'transform 150ms ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const card = style({
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.lg,
  background: vars.color.bgSurface,
  boxShadow: vars.shadow.cardSm,
  padding: '1rem 1.125rem',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
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

export const title = style({
  fontSize: vars.fontSize.lg,
  fontWeight: 600,
  color: vars.color.textPrimary,
  margin: 0,
});

export const period = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

export const subtitle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  marginTop: '0.25rem',
});

export const description = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  lineHeight: 1.6,
  marginTop: '0.625rem',
  whiteSpace: 'pre-line',
});

export const stackList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.375rem',
  listStyle: 'none',
  padding: 0,
  margin: '0.75rem 0 0',
});

export const stackChip = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textSecondary,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.full,
  padding: '0.125rem 0.5rem',
  background: vars.color.bgSoft,
});
