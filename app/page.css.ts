import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const main = style({
  minHeight: '100vh',
  width: '100%',
  paddingLeft: vars.spacing.pagePadMobile,
  paddingRight: vars.spacing.pagePadMobile,
  '@media': {
    [bp.md]: {
      paddingLeft: vars.spacing.pagePad,
      paddingRight: vars.spacing.pagePad,
    },
  },
});

export const hero = style({
  '@media': {
    [bp.md]: {
      paddingTop: '6rem',
      paddingBottom: '6rem',
    },
  },
});

export const heroName = style({
  fontSize: vars.fontSize['3xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  margin: 0,
  opacity: 0,
  animation: `${fadeUp} 0.8s ease forwards`,
  animationDelay: '0.1s',
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize['4xl'],
    },
    '(prefers-reduced-motion: reduce)': {
      opacity: 1,
      animation: 'none',
    },
  },
});

export const heroRole = style({
  fontSize: vars.fontSize.xl,
  color: vars.color.accentStrong,
  marginTop: '0.5rem',
  marginBottom: 0,
  opacity: 0,
  animation: `${fadeUp} 0.6s ease forwards`,
  animationDelay: '0.3s',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      opacity: 1,
      animation: 'none',
    },
  },
});

export const heroDesc = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textMuted,
  marginTop: '0.75rem',
  marginBottom: 0,
  opacity: 0,
  animation: `${fadeUp} 0.6s ease forwards`,
  animationDelay: '0.5s',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      opacity: 1,
      animation: 'none',
    },
  },
});

export const section = style({
  paddingTop: '2.5rem',
  paddingBottom: '2.5rem',
  borderTop: `1px solid ${vars.color.lineSoft}`,
});

export const sectionHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
});

export const sectionHeading = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  margin: 0,
});

export const sectionLink = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.accentStrong,
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
});

export const postGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});
