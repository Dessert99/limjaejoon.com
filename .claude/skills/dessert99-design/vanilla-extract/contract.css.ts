import { createThemeContract } from '@vanilla-extract/css';

/**
 * dessert99-blog · Material 3 color contract.
 * Token SHAPE only — values live in themes.css.ts (one impl per season×mode).
 * This is the createThemeContract practice target: name once, implement N times.
 */
export const color = createThemeContract({
  primary: null,
  onPrimary: null,
  primaryContainer: null,
  onPrimaryContainer: null,
  inversePrimary: null,
  secondary: null,
  onSecondary: null,
  secondaryContainer: null,
  onSecondaryContainer: null,
  tertiary: null,
  onTertiary: null,
  tertiaryContainer: null,
  onTertiaryContainer: null,
  error: null,
  onError: null,
  errorContainer: null,
  onErrorContainer: null,
  surface: null,
  onSurface: null,
  surfaceDim: null,
  surfaceBright: null,
  surfaceContainerLowest: null,
  surfaceContainerLow: null,
  surfaceContainer: null,
  surfaceContainerHigh: null,
  surfaceContainerHighest: null,
  surfaceVariant: null,
  onSurfaceVariant: null,
  outline: null,
  outlineVariant: null,
  inverseSurface: null,
  inverseOnSurface: null,
  background: null,
  onBackground: null,
});
