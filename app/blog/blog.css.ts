import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { surfaceCard } from '@/styles/utils.css';
import { bp } from '@/styles/breakpoints';

export const main = style({
  margin: '0 auto',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '80rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingTop: '7rem',
  paddingBottom: '2.5rem',
  '@media': {
    [bp.md]: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    },
  },
});

export const header = style([
  surfaceCard,
  {
    padding: '1.5rem',
    '@media': {
      [bp.md]: {
        padding: '2.5rem',
      },
    },
  },
]);

export const label = style({
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.accentStrong,
});

export const heading = style({
  marginTop: '0.75rem',
  fontSize: '1.875rem',
  fontWeight: 600,
  letterSpacing: '-0.025em',
  color: vars.color.textPrimary,
  '@media': {
    [bp.md]: {
      fontSize: '3rem',
    },
  },
});

export const description = style({
  marginTop: '1rem',
  maxWidth: '48rem',
  fontSize: '0.875rem',
  lineHeight: '1.75rem',
  color: vars.color.textSecondary,
  '@media': {
    [bp.md]: {
      fontSize: '1rem',
    },
  },
});

export const grid = style({
  marginTop: '2rem',
  display: 'grid',
  gap: '1rem',
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [bp.xl]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});

export const emptyText = style({
  marginTop: '3rem',
  textAlign: 'center',
  fontSize: '0.875rem',
  color: vars.color.textMuted,
});
