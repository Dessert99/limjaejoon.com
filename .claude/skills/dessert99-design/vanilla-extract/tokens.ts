/**
 * dessert99-blog · static (non-themed) design tokens.
 * These don't change per season — type scale, spacing, shape, elevation, motion.
 * Plain TS objects so you can use them directly inside style({}) / styleVariants.
 * (Only COLOR is a vanilla-extract themeContract — see contract.css.ts.)
 */

export const typeface = {
  brand: "'Pretendard Variable','Pretendard',-apple-system,'Apple SD Gothic Neo','Noto Sans KR',system-ui,sans-serif",
  plain: "'Pretendard Variable','Pretendard',-apple-system,'Apple SD Gothic Neo','Noto Sans KR',system-ui,sans-serif",
  mono:  "'D2Coding','Roboto Mono',ui-monospace,SFMono-Regular,Menlo,monospace",
} as const;

/** M3 type scale → CSS `font` shorthand (weight size/line-height family) */
export const typescale = {
  displayLarge:   `400 57px/64px ${typeface.brand}`,
  displayMedium:  `400 45px/52px ${typeface.brand}`,
  displaySmall:   `400 36px/44px ${typeface.brand}`,
  headlineLarge:  `600 32px/40px ${typeface.brand}`,
  headlineMedium: `600 28px/36px ${typeface.brand}`,
  headlineSmall:  `600 24px/32px ${typeface.brand}`,
  titleLarge:     `600 22px/28px ${typeface.brand}`,
  titleMedium:    `600 16px/24px ${typeface.brand}`,
  titleSmall:     `600 14px/20px ${typeface.brand}`,
  bodyLarge:      `400 16px/26px ${typeface.plain}`,
  bodyMedium:     `400 14px/22px ${typeface.plain}`,
  bodySmall:      `400 12px/16px ${typeface.plain}`,
  labelLarge:     `600 14px/20px ${typeface.brand}`,
  labelMedium:    `600 12px/16px ${typeface.brand}`,
  labelSmall:     `600 11px/16px ${typeface.brand}`,
} as const;

/** corner radii (M3 shape scale) */
export const radius = {
  none: '0px', xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '28px', full: '999px',
} as const;

/** 4dp spacing grid */
export const space = {
  0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px',
  6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px', 20: '80px',
} as const;

/** elevation (box-shadow) */
export const elevation = {
  0: 'none',
  1: '0 1px 2px rgba(0,0,0,.30), 0 1px 3px 1px rgba(0,0,0,.15)',
  2: '0 1px 2px rgba(0,0,0,.30), 0 2px 6px 2px rgba(0,0,0,.15)',
  3: '0 1px 3px rgba(0,0,0,.30), 0 4px 8px 3px rgba(0,0,0,.15)',
  4: '0 2px 3px rgba(0,0,0,.30), 0 6px 10px 4px rgba(0,0,0,.15)',
  5: '0 4px 4px rgba(0,0,0,.30), 0 8px 12px 6px rgba(0,0,0,.15)',
} as const;

/** state-layer opacities (overlay of content color) */
export const state = { hover: 0.08, focus: 0.10, pressed: 0.10, dragged: 0.16 } as const;

/** motion */
export const easing = {
  standard:             'cubic-bezier(0.2,0,0,1)',
  standardDecelerate:   'cubic-bezier(0,0,0,1)',
  standardAccelerate:   'cubic-bezier(0.3,0,1,1)',
  emphasized:           'cubic-bezier(0.2,0,0,1)',
  emphasizedDecelerate: 'cubic-bezier(0.05,0.7,0.1,1)',
  emphasizedAccelerate: 'cubic-bezier(0.3,0,0.8,0.15)',
} as const;
export const duration = { short: '200ms', medium: '350ms', long: '500ms', xlong: '700ms' } as const;
