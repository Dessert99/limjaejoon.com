import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const section = style({
  paddingTop: '2.5rem',
  paddingBottom: '2.5rem',
  '@media': {
    [bp.md]: {
      paddingTop: '3.5rem',
      paddingBottom: '3.5rem',
    },
  },
});

export const heading = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: 700,
  color: vars.color.textPrimary,
  margin: '0 0 1.5rem',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  '@media': {
    [bp.md]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const card = style({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.lg,
  background: vars.color.bgSurface,
  boxShadow: vars.shadow.cardSm,
  padding: '1.125rem 1.25rem',
  vars: {
    '--mx': '50%',
    '--my': '50%',
  },
  transition:
    'transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 250ms ease, box-shadow 250ms ease',

  '::before': {
    content: '""',
    position: 'absolute',
    inset: '-1px',
    borderRadius: 'inherit',
    pointerEvents: 'none',
    zIndex: 0,
    background: `radial-gradient(240px circle at var(--mx) var(--my), color-mix(in oklab, ${vars.color.accentStrong} 14%, transparent) 0%, transparent 60%)`,
    opacity: 0,
    transition: 'opacity 300ms ease',
  },
  '::after': {
    content: '""',
    position: 'absolute',
    left: '12px',
    right: '12px',
    top: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${vars.color.accentStrong}, transparent)`,
    opacity: 0,
    transform: 'scaleX(0.4)',
    transformOrigin: 'center',
    transition:
      'opacity 300ms ease, transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    zIndex: 1,
  },

  ':hover': {
    transform: 'translateY(-3px)',
    borderColor: vars.color.accentStrong,
    boxShadow: `${vars.shadow.cardMd}, 0 0 0 4px color-mix(in oklab, ${vars.color.accentStrong} 10%, transparent)`,
  },

  selectors: {
    '&:hover::before': {
      opacity: 1,
    },
    '&:hover::after': {
      opacity: 1,
      transform: 'scaleX(1)',
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: {
        '&::before': {
          transition: 'none',
        },
        '&::after': {
          transition: 'none',
        },
      },
    },
  },
});

export const corner = style({
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '12px',
  height: '12px',
  pointerEvents: 'none',
  zIndex: 2,
  opacity: 0,
  transform: 'translate(4px, -4px)',
  transition: 'opacity 300ms ease, transform 300ms ease',

  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '12px',
    height: '1.5px',
    background: vars.color.accentStrong,
    borderRadius: '1px',
  },
  '::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '1.5px',
    height: '12px',
    background: vars.color.accentStrong,
    borderRadius: '1px',
  },

  selectors: {
    [`${card}:hover &`]: {
      opacity: 1,
      transform: 'translate(0, 0)',
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const cardHeader = style({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  '@media': {
    [bp.md]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '1rem',
    },
  },
});

export const name = style({
  fontSize: vars.fontSize.lg,
  fontWeight: 600,
  color: vars.color.textPrimary,
  margin: 0,
});

export const period = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

export const description = style({
  position: 'relative',
  zIndex: 2,
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  lineHeight: 1.6,
  margin: 0,
});

export const stackList = style({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.375rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const stackChip = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textSecondary,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.full,
  padding: '0.125rem 0.5rem',
  background: vars.color.bgSoft,
});

export const linkList = style({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  listStyle: 'none',
  padding: 0,
  margin: '0.25rem 0 0',
});

export const link = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  fontSize: vars.fontSize.sm,
  color: vars.color.accentStrong,
  textDecoration: 'none',
  padding: '0.3rem 0.8rem',
  border: `1px solid ${vars.color.accentStrong}`,
  borderRadius: vars.radius.full,
  background: 'transparent',
  overflow: 'hidden',
  isolation: 'isolate',
  transition:
    'color 200ms ease, padding 200ms ease, box-shadow 200ms ease, background-color 200ms ease',

  ':hover': {
    background: vars.color.accentSoft,
    paddingRight: '1rem',
    boxShadow: `0 0 0 3px color-mix(in oklab, ${vars.color.accentStrong} 18%, transparent)`,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentStrong}`,
    outlineOffset: '2px',
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const linkArrow = style({
  display: 'inline-block',
  width: 0,
  opacity: 0,
  overflow: 'hidden',
  transition: 'width 220ms ease, opacity 220ms ease, margin-left 220ms ease',

  selectors: {
    [`${link}:hover &`]: {
      width: '0.9em',
      opacity: 1,
      marginLeft: '0.1rem',
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
