import { vars } from '@/styles/theme.css';
import { bp } from '@/styles/breakpoints';
import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
  textDecoration: 'none',
  paddingBlock: '0.75rem',
  borderBottom: `1px solid ${vars.color.lineSoft}`,
  transition: 'background-color 150ms ease',
  ':hover': {
    backgroundColor: vars.color.bgSoft,
  },
  '@media': {
    [bp.md]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
    },
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
  selectors: {
    [`${card}:hover &`]: {
      color: vars.color.accentStrong,
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
  padding: 0,
  margin: 0,
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
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  flexShrink: 0,
});
