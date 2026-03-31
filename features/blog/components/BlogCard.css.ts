import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: vars.radius.xl,
  backgroundColor: vars.color.bgElevated,
  textDecoration: 'none',
  overflow: 'hidden',
  transition: 'box-shadow 200ms ease, transform 200ms ease',
  ':hover': {
    boxShadow: vars.shadow.cardMd,
    transform: 'translateY(-2px)',
  },
});

export const cardBody = style({
  padding: '1.25rem',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  borderBottom: `1px solid ${vars.color.lineSoft}`,
});

export const title = style({
  fontSize: vars.fontSize.lg,
  fontWeight: 700,
  color: vars.color.textPrimary,
  lineHeight: '1.4',
  selectors: {
    [`${card}:hover &`]: {
      color: vars.color.accentStrong,
    },
  },
});

export const description = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  lineHeight: '1.6',
  overflow: 'hidden',
  maxHeight: '4.8rem', // ~3줄
});

export const cardFooter = style({
  padding: '0.75rem 1.25rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
});

export const tags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.375rem',
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
  paddingBlock: '0.15rem',
});

export const date = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.textMuted,
  flexShrink: 0,
});
