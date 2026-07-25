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
  background: vars.color.bg.canvas,
  color: vars.color.fg.neutral,
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize[16],
  lineHeight: vars.typography.lineHeight.normal,
});

globalStyle('button, input, textarea, select', {
  font: 'inherit',
});

// 버튼 UA 기본 배경(회색) 제거 — 실제 배경색은 variant가 책임진다
globalStyle('button', {
  backgroundColor: 'transparent',
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle(':focus-visible', {
  outline: `2px solid ${vars.color.stroke.brand}`,
  outlineOffset: vars.dimension.x0_5,
});
