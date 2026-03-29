import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { bp } from '@/styles/breakpoints';

export const header = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  borderBottom: `1px solid ${vars.color.lineSoft}`,
  backgroundColor: vars.color.bgPage,
});

export const inner = style({
  margin: '0 auto',
  display: 'flex',
  width: '100%',
  maxWidth: '80rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  '@media': {
    [bp.md]: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
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
  fontSize: '0.875rem',
  fontWeight: 600,
  color: vars.color.textSecondary,
  transition: 'color 150ms ease',
  ':hover': {
    color: vars.color.textPrimary,
  },
  '@media': {
    [bp.md]: {
      fontSize: '1rem',
    },
  },
});
