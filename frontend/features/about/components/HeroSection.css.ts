import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const hero = style({
  paddingTop: '3rem',
  paddingBottom: '3rem',
  '@media': {
    [bp.md]: {
      paddingTop: '6rem',
      paddingBottom: '4rem',
    },
  },
});

export const name = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  margin: 0,
  opacity: 0,
  animation: `${fadeUp} 0.8s ease forwards`,
  animationDelay: '0.1s',
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize['3xl'],
    },
    '(prefers-reduced-motion: reduce)': {
      opacity: 1,
      animation: 'none',
    },
  },
});

export const role = style({
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

export const taglineList = style({
  listStyle: 'none',
  padding: 0,
  marginTop: '1.25rem',
  marginBottom: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const taglineItem = style({
  position: 'relative',
  paddingLeft: '1rem',
  fontSize: vars.fontSize.base,
  color: vars.color.textSecondary,
  lineHeight: 1.6,
  opacity: 0,
  animation: `${fadeUp} 0.6s ease forwards`,
  '::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '0.625rem',
    width: '0.375rem',
    height: '0.375rem',
    borderRadius: vars.radius.full,
    background: vars.color.accentStrong,
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      opacity: 1,
      animation: 'none',
    },
  },
});

export const taglineStrong = style({
  color: vars.color.textPrimary,
  fontWeight: 600,
});
