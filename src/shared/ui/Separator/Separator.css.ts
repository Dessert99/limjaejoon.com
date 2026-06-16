/** Separator 선 — 1px, 방향은 data-orientation으로 분기 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 가로면 너비 가득 1px 높이, 세로면 높이 가득 1px 너비 */
export const separator = style({
  backgroundColor: vars.color.border,
  selectors: {
    '&[data-orientation="horizontal"]': { height: '1px', width: '100%' },
    '&[data-orientation="vertical"]': { width: '1px', height: '100%' },
  },
});
