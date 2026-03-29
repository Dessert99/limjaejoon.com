import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    bgPage: '#121212',
    bgSurface: '#121212',
    bgElevated: '#1a1a1a',
    bgSoft: '#2a2a2a',
    textPrimary: '#f5f5f5',
    textSecondary: '#d4d4d8',
    textMuted: '#a1a1aa',
    lineSoft: '#303030',
    lineStrong: '#4a4a4a',
    accentStrong: '#eb6900',
    accentSoft: 'rgba(235, 105, 0, 0.2)',
  },
  shadow: {
    cardSm: '0 1px 3px rgba(0, 0, 0, 0.24)',
    cardMd: '0 10px 28px rgba(0, 0, 0, 0.36)',
  },
  radius: {
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    x2l: '1rem',
    full: '9999px',
  },
});
