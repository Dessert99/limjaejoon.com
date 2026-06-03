import { bp } from '@/shared/styles/breakpoints';
import { color } from '@/shared/styles/theme-contract.css';
import { tokens } from '@/shared/styles/tokens.css';
import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

// MD3 hero — primary-container 풀컬러 표면(corner extra-large). 강조 표면이라 솔리드 풀컬러 허용.
export const hero = style({
  marginTop: '2rem',
  marginBottom: '1rem',
  padding: '2rem',
  borderRadius: tokens.shape.extraLarge,
  background: color.primaryContainer,
  color: color.onPrimaryContainer,
  '@media': {
    [bp.md]: {
      marginTop: '3rem',
      padding: '2.5rem',
    },
  },
});

export const name = style({
  font: tokens.typescale.headlineSmall,
  margin: 0,
  letterSpacing: '-0.01em',
  opacity: 0,
  animation: `${fadeUp} 0.8s ease forwards`,
  animationDelay: '0.1s',
  '@media': {
    [bp.md]: {
      font: tokens.typescale.headlineLarge,
    },
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
  maxWidth: '44rem',
});

export const taglineItem = style({
  position: 'relative',
  paddingLeft: '1.125rem',
  font: tokens.typescale.bodyLarge,
  opacity: 0,
  animation: `${fadeUp} 0.6s ease forwards`,
  '::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '0.6em',
    width: '7px',
    height: '7px',
    borderRadius: tokens.shape.full,
    background: 'currentColor',
    opacity: 0.75,
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      opacity: 1,
      animation: 'none',
    },
  },
});

export const taglineStrong = style({
  fontWeight: 600,
});
