import { vars } from '@/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  color: vars.color.accentStrong,
  backgroundColor: vars.color.accentSoft,
  borderRadius: vars.radius.md,
  paddingInline: '0.375rem',
  paddingBlock: '0.1rem',
  fontSize: 'inherit',
  textDecoration: 'none',
  lineHeight: '1.5',
  transition: 'background-color 150ms ease',
  ':hover': {
    backgroundColor: vars.color.accentStrong,
    color: vars.color.bgPage,
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accentStrong}`,
    outlineOffset: '1px',
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const icon = style({
  flexShrink: 0,
  width: '0.875em',
  height: '0.875em',
});
