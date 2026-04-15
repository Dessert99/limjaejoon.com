import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const hidden = style({
  opacity: 0,
  transform: 'translateY(20px)',
  willChange: 'opacity, transform',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      opacity: 1,
      transform: 'none',
    },
  },
});

export const visible = style({
  animation: `${fadeUp} 700ms ease forwards`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 1,
      transform: 'none',
    },
  },
});
