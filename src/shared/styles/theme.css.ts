import { createTheme, createThemeContract } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    background: null,
    surface: null,
    text: null,
    muted: null,
    border: null,
    accent: null,
  },
  font: {
    body: null,
    mono: null,
  },
  radius: {
    sm: null,
    md: null,
    lg: null,
  },
});

export const defaultThemeClass = createTheme(vars, {
  color: {
    background: '#f7f8fa',
    surface: '#ffffff',
    text: '#17181c',
    muted: '#626976',
    border: '#d9dde5',
    accent: '#2563eb',
  },
  font: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
});
