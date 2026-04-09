import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.75rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [bp.lg]: {
      gridTemplateColumns: 'repeat(6, 1fr)',
    },
  },
});

export const card = style({
  aspectRatio: '1',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: vars.fontSize.lg,
  fontWeight: 600,
  color: vars.color.textMuted,
  backgroundColor: vars.color.bgElevated,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.xl,
  padding: '1rem',
  cursor: 'pointer',
  wordBreak: 'break-word',
  transition:
    'color 150ms ease, border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease',
  ':hover': {
    color: vars.color.textPrimary,
    borderColor: vars.color.lineStrong,
    boxShadow: vars.shadow.cardSm,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentStrong}`,
    outlineOffset: '2px',
  },
  selectors: {
    '&[data-active="true"]': {
      color: vars.color.accentStrong,
      borderColor: vars.color.accentStrong,
      backgroundColor: vars.color.accentSoft,
    },
  },
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize.xl,
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
