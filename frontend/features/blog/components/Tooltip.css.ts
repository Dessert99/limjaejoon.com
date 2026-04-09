import { vars } from '@/styles/theme.css';
import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const rotate = keyframes({
  from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
  to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
});

const borderWidth = '1.5px';

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
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.5',
  color: vars.color.textPrimary,
  borderRadius: vars.radius.md,
  paddingInline: '1rem',
  paddingBlock: '0.75rem',
  pointerEvents: 'none',
  animation: `${fadeIn} 300ms ease-out`,
  overflow: 'hidden',
  isolation: 'isolate',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

globalStyle(`${popover}::before`, {
  content: '""',
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '150%',
  aspectRatio: '1',
  borderRadius: '50%',
  background: 'conic-gradient(#12b886, #845ef7, #339af0, #f06595, #12b886)',
  transform: 'translate(-50%, -50%)',
  animation: `${rotate} 3s linear infinite`,
  zIndex: -2,
});

globalStyle(`${popover}::after`, {
  content: '""',
  position: 'absolute',
  inset: borderWidth,
  borderRadius: `calc(${vars.radius.md} - ${borderWidth})`,
  backgroundColor: vars.color.bgElevated,
  zIndex: -1,
});

globalStyle(`${popover}::before`, {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});
