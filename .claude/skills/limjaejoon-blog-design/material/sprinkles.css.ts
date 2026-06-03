import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { color } from './theme-contract.css';
import { tokens } from './tokens.css';

/**
 * SPRINKLES — atomic, responsive utility props generated at build time.
 * This is the "scale-friendly" layer: instead of writing one-off `style({})`
 * for every margin/color, components compose typed props like
 *   <div className={sprinkles({ p: 'md', bg: 'surfaceContainer', display: 'flex' })} />
 *
 * Two property sets are merged:
 *   1. responsiveProperties — vary by breakpoint (mobile-first conditions)
 *   2. colorProperties      — bound to the season color contract (no breakpoints)
 */

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 600px)' },
    desktop: { '@media': 'screen and (min-width: 905px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'flex', 'grid', 'block', 'inline-flex'],
    flexDirection: ['row', 'column'],
    alignItems: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between'],
    gap: tokens.shape, // reuse the shape scale as a px gap scale (4/8/12/16/28)
    padding: tokens.shape,
    borderRadius: tokens.shape,
  },
  shorthands: {
    p: ['padding'],
    r: ['borderRadius'],
  },
});

/**
 * Color props read from the CONTRACT, so they resolve to whatever season is
 * active on an ancestor. `bg`/`c` cover the most common surface + on-color use.
 */
const colorProperties = defineProperties({
  properties: {
    background: color,
    color: color,
    borderColor: color,
  },
  shorthands: {
    bg: ['background'],
    c: ['color'],
  },
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);
export type Sprinkles = Parameters<typeof sprinkles>[0];
