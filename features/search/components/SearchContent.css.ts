import { vars } from '@/styles/theme.css';
import { bp } from '@/styles/breakpoints';
import { style } from '@vanilla-extract/css';

export const input = style({
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: vars.fontSize.base,
  color: vars.color.textPrimary,
  backgroundColor: vars.color.bgSoft,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.xl,
  outline: 'none',
  transition: 'border-color 150ms ease',
  ':focus-visible': {
    borderColor: vars.color.accentStrong,
  },
  '::placeholder': {
    color: vars.color.textMuted,
  },
  '@media': {
    [bp.md]: {
      fontSize: vars.fontSize.lg,
      padding: '0.875rem 1.25rem',
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const results = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '1.5rem',
});

export const emptyText = style({
  paddingTop: '2rem',
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
});
