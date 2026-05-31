/**
 * Example: a square "engineering note" post card built with vanilla-extract,
 * mirroring ui_kits/blog. Shows how the seasonal color contract + static tokens
 * combine. This is a reference, not wired into a build here.
 */
import { style } from '@vanilla-extract/css';
import { color } from './contract.css';
import { radius, space, typeface, easing, duration } from './tokens';

export const card = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  padding: `${space[4]} ${space[5]} ${space[4]}`,
  background: color.surfaceContainerLow,
  color: color.onSurface,
  border: `1px solid ${color.onSurface}`,
  borderRadius: radius.none,            // square — the signature
  fontFamily: typeface.mono,
  cursor: 'pointer',
  transition: `transform ${duration.short} ${easing.emphasized}, box-shadow ${duration.short} ${easing.emphasized}`,
  selectors: {
    '&:hover': {
      transform: 'translate(-3px,-3px)',
      boxShadow: `6px 6px 0 ${color.onSurface}`,
      background: color.surface,
    },
  },
});

export const cardHead = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: space[3],
  paddingBottom: space[3],
  marginBottom: space[3],
  borderBottom: `1px solid ${color.outlineVariant}`,
  fontSize: 12,
});

export const cardIndex = style({ color: color.primary, fontWeight: 700 });
export const cardCat = style({ color: color.onSurfaceVariant, letterSpacing: '0.4px' });

export const cardTitle = style({
  fontWeight: 700,
  fontSize: 18,
  lineHeight: 1.32,
  letterSpacing: '-0.6px',
  marginBottom: space[2],
  selectors: { [`${card}:hover &`]: { color: color.primary } },
});

export const cardExcerpt = style({
  fontFamily: typeface.plain,
  fontSize: 13,
  lineHeight: 1.7,
  color: color.onSurfaceVariant,
  flex: 1,
});

export const cardTags = style({
  display: 'flex',
  gap: space[2],
  marginTop: space[4],
  paddingTop: space[3],
  borderTop: `1px dashed ${color.outlineVariant}`,
  fontSize: 11,
  color: color.tertiary,
});
