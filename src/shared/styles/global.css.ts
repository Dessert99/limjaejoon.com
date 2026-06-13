import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

globalStyle('html', {
  scrollBehavior: 'smooth',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      scrollBehavior: 'auto',
    },
  },
});

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('body', {
  minHeight: '100vh',
  background: vars.color.background,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: '1rem',
  lineHeight: 1.5,
});

globalStyle('button, input, textarea, select', {
  font: 'inherit',
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle(':focus-visible', {
  outline: `2px solid ${vars.color.accent}`,
  outlineOffset: '2px',
});
