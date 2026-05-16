import { keyframes, style } from '@vanilla-extract/css';

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
