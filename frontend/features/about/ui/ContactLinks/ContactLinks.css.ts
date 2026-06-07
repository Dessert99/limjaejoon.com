import { sprinkles } from '@/shared/styles/sprinkles.css';
import { keyframes, style } from '@vanilla-extract/css';

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const list = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8',
    padding: 'none',
    marginTop: '20',
    marginInline: 'none',
    marginBottom: 'none',
  }),
  {
    listStyle: 'none',
    opacity: 0,
    animation: `${fadeIn} 0.6s ease forwards`,
    animationDelay: '0.7s',
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        opacity: 1,
        animation: 'none',
      },
    },
  },
]);
