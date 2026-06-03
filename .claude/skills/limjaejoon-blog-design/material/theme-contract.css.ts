import { createThemeContract } from '@vanilla-extract/css';

/**
 * The CONTRACT: the *shape* of a season's color palette, with no values.
 * Every season (themes/*.css.ts) must satisfy this exact shape via createTheme.
 * Consumers reference `color.primary` etc. and the active season class swaps
 * the underlying values — this is the core MD3 "color roles" indirection.
 *
 * Roles follow Material Design 3 sys-color naming.
 */
export const color = createThemeContract({
  primary: null,
  onPrimary: null,
  primaryContainer: null,
  onPrimaryContainer: null,
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
  background: null,
  onBackground: null,
  surface: null,
  onSurface: null,
  surfaceVariant: null,
  onSurfaceVariant: null,
  surfaceDim: null,
  surfaceBright: null,
  surfaceContainerLowest: null,
  surfaceContainerLow: null,
  surfaceContainer: null,
  surfaceContainerHigh: null,
  surfaceContainerHighest: null,
  outline: null,
  outlineVariant: null,
  inverseSurface: null,
  inverseOnSurface: null,
  inversePrimary: null,
  shadow: null,
  scrim: null,
  surfaceTint: null,
});
