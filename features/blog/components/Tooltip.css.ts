import { vars } from '@/styles/theme.css';
import { keyframes, style } from '@vanilla-extract/css';

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const wrapper = style({
  position: 'relative',
  display: 'inline',
});

export const trigger = style({
  textDecoration: 'underline',
  textDecorationStyle: 'dotted',
  textDecorationColor: vars.color.textMuted,
  textUnderlineOffset: '2px',
  cursor: 'help',
  color: 'inherit',
});

export const popover = style({
  position: 'absolute',
  bottom: 'calc(100% + 6px)',
  left: '50%',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.xs,
  color: vars.color.textPrimary,
  backgroundColor: vars.color.bgElevated,
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.md,
  paddingInline: '0.5rem',
  paddingBlock: '0.25rem',
  boxShadow: vars.shadow.cardSm,
  pointerEvents: 'none',
  animation: `${fadeIn} 150ms ease-out`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});
