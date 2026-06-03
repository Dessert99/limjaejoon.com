import { createGlobalTheme } from '@vanilla-extract/css';

/**
 * Static design tokens that DON'T change between seasons — type scale, shape,
 * state-layer opacities, elevation, motion. Bound to :root once.
 * Per-season COLOR roles live in theme-contract + themes/* instead.
 *
 * Mirrors the `:root{}` block of /colors_and_type.css.
 */
export const tokens = createGlobalTheme(':root', {
  typeface: {
    brand: "'Roboto', 'Pretendard Variable', Pretendard, system-ui, sans-serif",
    plain: "'Roboto', 'Pretendard Variable', Pretendard, system-ui, sans-serif",
    mono: "'Roboto Mono', ui-monospace, Menlo, monospace",
  },
  typescale: {
    displayLarge: '400 3.5625rem/4rem var(--mdRefTypefaceBrand, Roboto)',
    displayMedium: '400 2.8125rem/3.25rem Roboto',
    displaySmall: '400 2.25rem/2.75rem Roboto',
    headlineLarge: '400 2rem/2.5rem Roboto',
    headlineMedium: '400 1.75rem/2.25rem Roboto',
    headlineSmall: '400 1.5rem/2rem Roboto',
    titleLarge: '400 1.375rem/1.75rem Roboto',
    titleMedium: '500 1rem/1.5rem Roboto',
    titleSmall: '500 0.875rem/1.25rem Roboto',
    bodyLarge: '400 1rem/1.5rem Roboto',
    bodyMedium: '400 0.875rem/1.25rem Roboto',
    bodySmall: '400 0.75rem/1rem Roboto',
    labelLarge: '500 0.875rem/1.25rem Roboto',
    labelMedium: '500 0.75rem/1rem Roboto',
    labelSmall: '500 0.6875rem/1rem Roboto',
  },
  shape: {
    none: '0', extraSmall: '4px', small: '8px', medium: '12px',
    large: '16px', extraLarge: '28px', full: '9999px',
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
    durationShort: '150ms', durationMedium: '250ms', durationLong: '400ms',
  },
});
