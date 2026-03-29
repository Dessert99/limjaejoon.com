import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { surfaceCard, surfaceSubtle } from '@/styles/utils.css';
import { bp } from '@/styles/breakpoints';

export const main = style({
  margin: '0 auto',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '80rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingTop: '2.5rem',
  paddingBottom: '2.5rem',
  '@media': {
    [bp.md]: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    },
  },
});

export const pageTitle = style({
  fontSize: '1.875rem',
  fontWeight: 600,
  letterSpacing: '-0.025em',
  color: vars.color.textPrimary,
  '@media': {
    [bp.md]: {
      fontSize: '2.25rem',
    },
  },
});

export const profileCard = style([
  surfaceCard,
  {
    marginTop: '1.5rem',
    padding: '1.5rem',
    '@media': {
      [bp.md]: {
        padding: '2rem',
      },
    },
  },
]);

export const profileGrid = style({
  display: 'grid',
  gap: '1.5rem',
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(5, 1fr)',
      alignItems: 'center',
    },
  },
});

export const logoWrapper = style({
  justifySelf: 'start',
  overflow: 'hidden',
  borderRadius: vars.radius.x2l,
  border: `1px solid ${vars.color.lineSoft}`,
  backgroundColor: vars.color.bgSoft,
  '@media': {
    [bp.md]: {
      gridColumn: 'span 1',
    },
  },
});

export const logoImg = style({
  height: '9rem',
  width: '9rem',
  objectFit: 'cover',
});

export const profileInfo = style({
  '@media': {
    [bp.md]: {
      gridColumn: 'span 4',
    },
  },
});

export const profileLabel = style({
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.accentStrong,
});

export const profileName = style({
  marginTop: '0.75rem',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: vars.color.textPrimary,
  '@media': {
    [bp.md]: {
      fontSize: '1.875rem',
    },
  },
});

export const contentGrid = style({
  marginTop: '1.5rem',
  display: 'grid',
  gap: '1rem',
  '@media': {
    [bp.lg]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
});

export const sectionCard = style([
  surfaceCard,
  {
    padding: '1.5rem',
  },
]);

export const sectionTitle = style({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: vars.color.textPrimary,
});

export const stackList = style({
  marginTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  listStyle: 'none',
});

export const stackItem = style([
  surfaceSubtle,
  {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
  },
]);

export const iconWrapper = style({
  display: 'inline-flex',
  height: '2.75rem',
  width: '2.75rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.lineSoft}`,
  backgroundColor: vars.color.bgElevated,
  fontSize: '1.5rem',
});

export const stackName = style({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: vars.color.textPrimary,
  '@media': {
    [bp.md]: {
      fontSize: '1rem',
    },
  },
});

export const activityList = style({
  marginTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const activityGroup = style([
  surfaceSubtle,
  {
    padding: '1rem',
  },
]);

export const orgLabel = style({
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.accentStrong,
});

export const roleList = style({
  marginTop: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  listStyle: 'none',
});

export const roleItem = style({
  fontSize: '0.875rem',
  color: vars.color.textSecondary,
  '@media': {
    [bp.md]: {
      fontSize: '1rem',
    },
  },
});
