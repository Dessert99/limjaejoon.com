import { vars } from '@/styles/theme.css';
import { bp } from '@/styles/breakpoints';
import { style } from '@vanilla-extract/css';

export const section = style({
  paddingTop: '2.5rem',
  paddingBottom: '2.5rem',
  borderTop: `1px solid ${vars.color.lineSoft}`,
});

export const header = style({
  marginBottom: '1.5rem',
});

export const title = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: 600,
  color: vars.color.textPrimary,
  margin: 0,
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize['3xl'],
    },
  },
});

export const description = style({
  marginTop: '0.5rem',
  marginBottom: 0,
  fontSize: vars.fontSize.base,
  color: vars.color.textMuted,
});

export const cards = style({
  marginTop: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  scrollMarginTop: '8rem',
});

export const storyCard = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  textDecoration: 'none',
  paddingBlock: '0.75rem',
  borderBottom: `1px solid ${vars.color.lineSoft}`,
  transition: 'background-color 150ms ease',
  ':hover': {
    backgroundColor: vars.color.bgSoft,
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const storyTitle = style({
  fontSize: vars.fontSize.base,
  fontWeight: 600,
  color: vars.color.textPrimary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  selectors: {
    [`${storyCard}:hover &`]: {
      color: vars.color.accentStrong,
    },
  },
});

export const storyDate = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  flexShrink: 0,
});
