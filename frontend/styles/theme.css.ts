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
    bgPageTranslucent: 'rgba(18, 18, 18, 0.8)',
    // 에러·위험 상태용 — 폼 검증 실패, 파괴적 액션 경고에 사용
    colorDanger: '#ff6b6b',
    colorDangerSubtle: 'rgba(255, 107, 107, 0.12)',
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
  font: {
    mono: 'var(--font-jetbrains-mono), ui-monospace, "SF Mono", Menlo, Consolas, "D2Coding", monospace',
  },
});

export const lightTheme = createTheme(vars, {
  color: {
    bgPage: '#ffffff',
    bgSurface: '#ffffff',
    bgElevated: '#f8f9fa',
    bgSoft: '#f1f3f5',
    textPrimary: '#1a1a1a',
    textSecondary: '#495057',
    textMuted: '#868e96',
    lineSoft: '#e9ecef',
    lineStrong: '#ced4da',
    accentStrong: '#0ca678',
    accentSoft: 'rgba(12, 166, 120, 0.1)',
    bgPageTranslucent: 'rgba(255, 255, 255, 0.8)',
    // 라이트 모드: 더 진한 레드 계열로 가독성 확보
    colorDanger: '#e03131',
    colorDangerSubtle: 'rgba(224, 49, 49, 0.08)',
  },
  shadow: {
    cardSm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    cardMd: '0 10px 28px rgba(0, 0, 0, 0.12)',
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
    pagePad: '6rem',
  },
  font: {
    mono: 'var(--font-jetbrains-mono), ui-monospace, "SF Mono", Menlo, Consolas, "D2Coding", monospace',
  },
});
