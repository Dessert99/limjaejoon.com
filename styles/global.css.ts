import { globalStyle } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

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
