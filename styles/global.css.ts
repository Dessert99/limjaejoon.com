import { globalStyle } from '@vanilla-extract/css';
import { darkTheme, lightTheme, vars } from '@/styles/theme.css';

globalStyle('html', {
  transition: 'background-color 200ms ease, color 200ms ease',
});

globalStyle('html[data-loading]', {
  transition: 'none',
});

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('body', {
  minHeight: '100vh',
  backgroundColor: vars.color.bgPage,
  color: vars.color.textPrimary,
});

globalStyle(':focus-visible', {
  outline: `2px solid ${vars.color.accentStrong}`,
  outlineOffset: '2px',
});

// rehype-pretty-code 다크/라이트 테마 브릿지
globalStyle(`.${darkTheme} [data-rehype-pretty-code-figure] span`, {
  color: 'var(--shiki-dark)',
});
globalStyle(`.${lightTheme} [data-rehype-pretty-code-figure] span`, {
  color: 'var(--shiki-light)',
});
