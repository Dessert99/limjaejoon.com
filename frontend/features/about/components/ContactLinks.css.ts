import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  listStyle: 'none',
  padding: 0,
  margin: '1.25rem 0 0',
  opacity: 0,
  animation: `${fadeIn} 0.6s ease forwards`,
  animationDelay: '0.7s',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      opacity: 1,
      animation: 'none',
    },
  },
});

export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.lineSoft}`,
  background: vars.color.bgSurface,
  color: vars.color.textSecondary,
  fontSize: vars.fontSize.xl,
  transition:
    'color 150ms ease, border-color 150ms ease, background-color 150ms ease, transform 150ms ease',
  ':hover': {
    color: vars.color.accentStrong,
    borderColor: vars.color.accentStrong,
    background: vars.color.accentSoft,
    transform: 'translateY(-2px)',
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
