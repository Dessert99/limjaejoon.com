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
  backgroundColor: vars.color.bgPageTranslucent,
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

export const iconBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: vars.radius.xl,
  border: '1px solid transparent',
  backgroundColor: 'transparent',
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.xl,
  cursor: 'pointer',
  transition:
    'color 150ms ease, border-color 150ms ease, background-color 150ms ease',
  ':hover': {
    color: vars.color.accentStrong,
    backgroundColor: vars.color.accentSoft,
    borderColor: vars.color.accentStrong,
  },
  ':focus-visible': {
    color: vars.color.accentStrong,
    backgroundColor: vars.color.accentSoft,
    borderColor: vars.color.accentStrong,
  },
  selectors: {
    '&[data-active="true"]': {
      color: vars.color.accentStrong,
      backgroundColor: vars.color.accentSoft,
      borderColor: vars.color.accentStrong,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const navLink = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  paddingTop: '0.375rem',
  paddingBottom: '0.375rem',
  paddingLeft: '0.125rem',
  paddingRight: '0.125rem',
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.textSecondary,
  textDecoration: 'none',
  backgroundColor: 'transparent',
  border: 'none',
  transition: 'color 180ms ease',

  '::after': {
    content: '""',
    position: 'absolute',
    left: '0.125rem',
    right: '0.125rem',
    bottom: '0.125rem',
    height: '2px',
    background: vars.color.accentStrong,
    borderRadius: '2px',
    transformOrigin: 'left center',
    transform: 'scaleX(0)',
    transition: 'transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  },

  ':hover': {
    color: vars.color.textPrimary,
  },

  selectors: {
    '&:hover::after': {
      transform: 'scaleX(1)',
    },
    '&[data-active="true"]': {
      color: vars.color.textPrimary,
    },
    '&[data-active="true"]::after': {
      transform: 'scaleX(1)',
    },
  },

  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize.base,
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: {
        '&::after': {
          transition: 'none',
        },
      },
    },
  },
});

export const navDot = style({
  width: '5px',
  height: '5px',
  borderRadius: vars.radius.full,
  background: vars.color.accentStrong,
  opacity: 0,
  transform: 'translateX(-4px)',
  transition: 'opacity 200ms ease, transform 200ms ease',

  selectors: {
    [`${navLink}:hover &`]: {
      opacity: 1,
      transform: 'translateX(0)',
    },
    [`${navLink}[data-active="true"] &`]: {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
