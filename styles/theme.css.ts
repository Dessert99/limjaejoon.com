import { createTheme } from '@vanilla-extract/css';

export const [darkTheme, vars] = createTheme({
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
    accentStrong: '#12b886',
    accentSoft: 'rgba(18, 184, 134, 0.15)',
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
  fontSize: {
    xs: '0.75rem', // label, caption
    sm: '0.875rem', // small body
    base: '1rem', // body
    lg: '1.125rem', // slightly large
    xl: '1.25rem', // subtitle
    '2xl': '1.5rem', // section title
    '3xl': '1.875rem', // page heading (mobile)
    '4xl': '2.25rem', // page heading (desktop)
    '5xl': '3rem', // hero heading
  },
  spacing: {
    pagePadMobile: '1rem', // page horizontal padding (mobile)
    pagePad: '6rem', // page horizontal padding (≥md)
  },
});

export const lightTheme = createTheme(vars, {
  color: {
    bgPage: '',
    bgSurface: '',
    bgElevated: '',
    bgSoft: '',
    textPrimary: '',
    textSecondary: '',
    textMuted: '',
    lineSoft: '',
    lineStrong: '',
    accentStrong: '',
    accentSoft: '',
  },
  shadow: {
    cardSm: '',
    cardMd: '',
  },
  radius: {
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    x2l: '1rem',
    full: '9999px',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  spacing: {
    pagePadMobile: '1rem',
    pagePad: '1.5rem',
  },
});
