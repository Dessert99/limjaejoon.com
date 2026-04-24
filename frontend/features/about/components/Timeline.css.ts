import { bp } from '@/styles/breakpoints';
import { vars } from '@/styles/theme.css';
import { keyframes, style } from '@vanilla-extract/css';

const pulse = keyframes({
  '0%': {
    boxShadow: `0 0 0 0 color-mix(in oklab, ${vars.color.accentStrong} 50%, transparent), 0 0 0 3px ${vars.color.bgPage}`,
  },
  '70%': {
    boxShadow: `0 0 0 8px color-mix(in oklab, ${vars.color.accentStrong} 0%, transparent), 0 0 0 3px ${vars.color.bgPage}`,
  },
  '100%': {
    boxShadow: `0 0 0 0 color-mix(in oklab, ${vars.color.accentStrong} 0%, transparent), 0 0 0 3px ${vars.color.bgPage}`,
  },
});

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

export const list = style({
  position: 'relative',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  paddingLeft: '1.5rem',
  '::before': {
    content: '""',
    position: 'absolute',
    top: '0.5rem',
    bottom: '0.5rem',
    left: '0.3125rem',
    width: '2px',
    background: vars.color.lineSoft,
    borderRadius: vars.radius.full,
  },
  '::after': {
    content: '""',
    position: 'absolute',
    top: '0.5rem',
    left: '0.3125rem',
    width: '2px',
    height: 'calc(100% - 1.5rem)',
    background: `linear-gradient(180deg, ${vars.color.accentStrong}, color-mix(in oklab, ${vars.color.accentStrong} 30%, transparent))`,
    borderRadius: vars.radius.full,
    WebkitMaskImage: 'linear-gradient(180deg, #000 0 60%, transparent 100%)',
    maskImage: 'linear-gradient(180deg, #000 0 60%, transparent 100%)',
  },
});

export const item = style({
  position: 'relative',
  paddingBottom: '1.5rem',
  selectors: {
    '&:last-child': {
      paddingBottom: 0,
    },
  },
});

export const marker = style({
  position: 'absolute',
  left: '-1.4375rem',
  top: '0.4375rem',
  width: '0.75rem',
  height: '0.75rem',
  borderRadius: vars.radius.full,
  background: vars.color.accentStrong,
  boxShadow: `0 0 0 3px ${vars.color.bgPage}`,
  transition: 'transform 150ms ease',

  selectors: {
    [`${item}:first-child &`]: {
      animation: `${pulse} 2.2s ease-out infinite`,
    },
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: {
        [`${item}:first-child &`]: {
          animation: 'none',
        },
      },
    },
  },
});

export const card = style({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.lg,
  background: vars.color.bgSurface,
  boxShadow: vars.shadow.cardSm,
  padding: '1rem 1.25rem 1rem 1.25rem',
  transition:
    'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',

  '::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '10px',
    bottom: '10px',
    width: '2px',
    background: vars.color.accentStrong,
    borderRadius: '2px',
    transform: 'scaleY(0.35)',
    transformOrigin: 'top',
    transition: 'transform 300ms ease',
  },
  '::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    background: `radial-gradient(120% 60% at 100% 0%, color-mix(in oklab, ${vars.color.accentStrong} 7%, transparent), transparent 55%)`,
    opacity: 0,
    transition: 'opacity 300ms ease',
  },

  ':hover': {
    borderColor: `color-mix(in oklab, ${vars.color.accentStrong} 40%, ${vars.color.lineSoft})`,
    boxShadow: vars.shadow.cardMd,
  },

  selectors: {
    '&:hover::before': {
      transform: 'scaleY(1)',
    },
    '&:hover::after': {
      opacity: 1,
    },
    [`${item}:first-child &::before`]: {
      transform: 'scaleY(1)',
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

export const cardHeader = style({
  position: 'relative',
  zIndex: 1,
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

export const title = style({
  fontSize: vars.fontSize.lg,
  fontWeight: 600,
  color: vars.color.textPrimary,
  margin: 0,
});

export const period = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});

export const subtitle = style({
  position: 'relative',
  zIndex: 1,
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  marginTop: '0.25rem',
});

export const description = style({
  position: 'relative',
  zIndex: 1,
  fontSize: vars.fontSize.sm,
  color: vars.color.textSecondary,
  lineHeight: 1.6,
  marginTop: '0.625rem',
  whiteSpace: 'pre-line',
});

export const stackList = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.375rem',
  listStyle: 'none',
  padding: 0,
  margin: '0.75rem 0 0',
});

export const stackChip = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textSecondary,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.full,
  padding: '0.125rem 0.5rem',
  background: vars.color.bgSoft,
});
