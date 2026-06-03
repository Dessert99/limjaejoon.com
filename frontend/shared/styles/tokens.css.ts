import { createGlobalTheme } from '@vanilla-extract/css';

// 계절과 무관한 정적 디자인 토큰 — type scale / shape / state layer / elevation / motion.
// :root 에 한 번만 바인딩한다. 계절별 COLOR 역할은 theme-contract + themes/* 가 담당.
// (MD3 sys 토큰의 vanilla-extract 미러. 색만 동적, 나머지는 전부 정적.)

// next/font 변수로 배선한 폰트 스택 — Latin=Roboto, 한글은 Pretendard 로 폴백, 코드=Roboto Mono
const sans =
  "var(--font-roboto), 'Pretendard Variable', Pretendard, system-ui, sans-serif";
const mono =
  'var(--font-roboto-mono), ui-monospace, Menlo, Consolas, monospace';

export const tokens = createGlobalTheme(':root', {
  typeface: {
    brand: sans,
    plain: sans,
    mono,
  },
  typescale: {
    displayLarge: `400 3.5625rem/4rem ${sans}`,
    displayMedium: `400 2.8125rem/3.25rem ${sans}`,
    displaySmall: `400 2.25rem/2.75rem ${sans}`,
    headlineLarge: `400 2rem/2.5rem ${sans}`,
    headlineMedium: `400 1.75rem/2.25rem ${sans}`,
    headlineSmall: `400 1.5rem/2rem ${sans}`,
    titleLarge: `400 1.375rem/1.75rem ${sans}`,
    titleMedium: `500 1rem/1.5rem ${sans}`,
    titleSmall: `500 0.875rem/1.25rem ${sans}`,
    bodyLarge: `400 1rem/1.5rem ${sans}`,
    bodyMedium: `400 0.875rem/1.25rem ${sans}`,
    bodySmall: `400 0.75rem/1rem ${sans}`,
    labelLarge: `500 0.875rem/1.25rem ${sans}`,
    labelMedium: `500 0.75rem/1rem ${sans}`,
    labelSmall: `500 0.6875rem/1rem ${sans}`,
  },
  shape: {
    none: '0',
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '28px',
    full: '9999px',
  },
  state: { hover: '0.08', focus: '0.12', pressed: '0.12', dragged: '0.16' },
  elevation: {
    level0: 'none',
    level1: '0 1px 2px rgba(0,0,0,.30), 0 1px 3px 1px rgba(0,0,0,.15)',
    level2: '0 1px 2px rgba(0,0,0,.30), 0 2px 6px 2px rgba(0,0,0,.15)',
    level3: '0 1px 3px rgba(0,0,0,.30), 0 4px 8px 3px rgba(0,0,0,.15)',
    level4: '0 2px 3px rgba(0,0,0,.30), 0 6px 10px 4px rgba(0,0,0,.15)',
    level5: '0 4px 4px rgba(0,0,0,.30), 0 8px 12px 6px rgba(0,0,0,.15)',
  },
  motion: {
    easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
    easingEmphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    durationShort: '150ms',
    durationMedium: '250ms',
    durationLong: '400ms',
  },
});
