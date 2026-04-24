import { vars } from '@/styles/theme.css';
import { bp } from '@/styles/breakpoints';
import { style } from '@vanilla-extract/css';

export const card = style({
  position: 'relative',
  isolation: 'isolate',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: '0.875rem',
  textDecoration: 'none',
  paddingBlock: '0.875rem',
  paddingLeft: '1.125rem',
  paddingRight: '0.875rem',
  borderBottom: `1px solid ${vars.color.lineSoft}`,
  counterIncrement: 'post',
  transition: 'background-color 200ms ease, padding 250ms ease',

  '::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '10px',
    bottom: '10px',
    width: '2px',
    background: vars.color.accentStrong,
    borderRadius: '2px',
    transform: 'scaleY(0)',
    transformOrigin: 'center',
    transition: 'transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  '::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    borderRadius: vars.radius.md,
    background: `linear-gradient(90deg, ${vars.color.bgSoft}, transparent 70%)`,
    opacity: 0,
    transition: 'opacity 250ms ease',
  },

  ':hover': {
    paddingLeft: '1.375rem',
  },

  selectors: {
    '&:hover::before': {
      transform: 'scaleY(1)',
    },
    '&:hover::after': {
      opacity: 1,
    },
  },

  '@media': {
    [bp.md]: {
      gap: '1rem',
    },
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

export const idx = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  fontFeatureSettings: '"tnum"',
  minWidth: '1.625rem',
  opacity: 0.55,
  transition: 'color 200ms ease, opacity 200ms ease',

  '::before': {
    content: 'counter(post, decimal-leading-zero)',
  },

  selectors: {
    [`${card}:hover &`]: {
      color: vars.color.accentStrong,
      opacity: 1,
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const titleWrap = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  minWidth: 0,
});

export const arrow = style({
  display: 'inline-block',
  color: vars.color.accentStrong,
  width: 0,
  opacity: 0,
  overflow: 'hidden',
  flexShrink: 0,
  transform: 'translateX(-4px)',
  transition: 'width 220ms ease, opacity 220ms ease, transform 220ms ease',

  selectors: {
    [`${card}:hover &`]: {
      width: '0.875rem',
      opacity: 1,
      transform: 'translateX(0)',
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const title = style({
  fontSize: vars.fontSize.base,
  fontWeight: 600,
  color: vars.color.textPrimary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  transition: 'color 200ms ease',

  selectors: {
    [`${card}:hover &`]: {
      color: vars.color.accentStrong,
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const meta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexShrink: 0,
});

export const tags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.25rem',
  listStyle: 'none',
});

export const tag = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.accentStrong,
  backgroundColor: vars.color.accentSoft,
  borderRadius: vars.radius.full,
  paddingInline: '0.5rem',
  paddingBlock: '0.125rem',
});

export const date = style({
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  fontFeatureSettings: '"tnum"',
  flexShrink: 0,
});
