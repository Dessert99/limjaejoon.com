/** TransitionControls — 컨트롤 그룹 배치와 개념 노트 타이포 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x6' }),
]);

export const group = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x2' }),
]);

export const groupTitle = style({
  fontSize: vars.typography.fontSize[14],
  fontWeight: 600,
  fontFamily: 'monospace',
});

export const toggleRow = style([
  sprinkles({ display: 'flex', flexWrap: 'wrap', gap: 'x1' }),
]);

/** 개념 노트 — 본문보다 낮은 위계의 학습 메모 */
export const note = style({
  color: vars.color.fg.muted,
  fontSize: vars.typography.fontSize[14],
  lineHeight: 1.6,
});
