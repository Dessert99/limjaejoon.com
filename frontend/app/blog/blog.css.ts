import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const main = style({
  margin: '0 auto',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '72rem',
  paddingLeft: vars.spacing.pagePadMobile,
  paddingRight: vars.spacing.pagePadMobile,
  paddingBottom: '4rem',
  '@media': {
    [bp.md]: {
      paddingLeft: '3rem',
      paddingRight: '3rem',
    },
  },
});

export const header = style({
  marginBottom: '2rem',
  paddingBottom: '1.5rem',
  borderBottom: `1px solid ${vars.color.lineSoft}`,
});

export const heading = style({
  fontSize: vars.fontSize['3xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  letterSpacing: '-0.02em',
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize['4xl'],
    },
  },
});

export const description = style({
  marginTop: '0.5rem',
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  lineHeight: '1.6',
});

export const layout = style({
  display: 'grid',
  gap: '1.5rem',
  '@media': {
    [bp.md]: {
      gridTemplateColumns: '9rem 1fr',
      alignItems: 'start',
    },
  },
});
