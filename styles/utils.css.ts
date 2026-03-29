import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const surfaceCard = style({
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.lg,
  background: vars.color.bgSurface,
  boxShadow: vars.shadow.cardSm,
});

export const surfaceSubtle = style({
  border: `1px solid ${vars.color.lineSoft}`,
  borderRadius: vars.radius.md,
  background: vars.color.bgSoft,
});
