import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { surfaceCard } from '@/styles/utils.css';
import { bp } from '@/styles/breakpoints';

export const main = style({
  margin: '0 auto',
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '80rem',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  '@media': {
    [bp.md]: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    },
  },
});

export const card = style([
  surfaceCard,
  {
    width: '100%',
    maxWidth: '36rem',
    padding: '2rem',
    textAlign: 'center',
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
  color: vars.color.textPrimary,
});

export const body = style({
  marginTop: '0.75rem',
  fontSize: '0.875rem',
  color: vars.color.textSecondary,
});

export const homeLink = style({
  marginTop: '1.25rem',
  display: 'inline-flex',
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.lineStrong}`,
  backgroundColor: vars.color.bgSoft,
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: vars.color.accentStrong,
  transition: 'background-color 150ms ease',
  ':hover': {
    backgroundColor: vars.color.accentSoft,
  },
});
