import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const header = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  borderBottom: `1px solid ${vars.color.lineSoft}`,
  backgroundColor: 'rgba(18, 18, 18, 0.8)',
  backdropFilter: 'blur(8px)',
});

export const inner = style({
  margin: '0 auto',
  display: 'flex',
  width: '100%',
  maxWidth: '80rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '0.875rem',
  paddingBottom: '0.875rem',
  paddingLeft: vars.spacing.pagePadMobile,
  paddingRight: vars.spacing.pagePadMobile,
  '@media': {
    [bp.md]: {
      paddingLeft: vars.spacing.pagePad,
      paddingRight: vars.spacing.pagePad,
    },
  },
});

export const logoLink = style({
  display: 'inline-flex',
  height: '3rem',
  width: '3rem',
  overflow: 'hidden',
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.lineSoft}`,
  backgroundColor: vars.color.bgSoft,
});

export const logoImg = style({
  height: '3rem',
  width: '3rem',
  objectFit: 'cover',
});

export const navList = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  listStyle: 'none',
  '@media': {
    [bp.md]: {
      gap: '1.5rem',
    },
  },
});

export const navLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: vars.radius.xl,
  border: '1px solid transparent',
  paddingLeft: '0.625rem',
  paddingRight: '0.625rem',
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.textSecondary,
  textDecoration: 'none',
  transition:
    'color 150ms ease, border-color 150ms ease, background-color 150ms ease',
  ':hover': {
    color: vars.color.accentStrong,
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
      fontSize: vars.fontSize.base,
    },
  },
});
