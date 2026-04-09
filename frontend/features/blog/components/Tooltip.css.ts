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
  bottom: 'calc(100% + 8px)',
  left: '70%',
  transform: 'translateX(-50%)',
  width: '20rem',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.5',
  color: vars.color.textPrimary,
  backgroundColor: vars.color.bgElevated,
  border: `1px solid ${vars.color.accentStrong}`,
  borderRadius: vars.radius.md,
  paddingInline: '1rem',
  paddingBlock: '0.75rem',
  pointerEvents: 'none',
  boxShadow: `0 0 8px ${vars.color.accentSoft}`,
  animation: `${fadeIn} 300ms ease-out`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});
