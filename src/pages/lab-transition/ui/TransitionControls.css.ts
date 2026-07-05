/** TransitionControls — 컨트롤 그룹 배치와 개념 노트 타이포 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

export const root = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '24' })]);

export const group = style([sprinkles({ display: 'flex', flexDirection: 'column', gap: '8' })]);

export const groupTitle = style({
  fontSize: '0.875rem',
  fontWeight: 600,
  fontFamily: 'monospace',
});

export const toggleRow = style([sprinkles({ display: 'flex', flexWrap: 'wrap', gap: '4' })]);

/** 개념 노트 — 본문보다 낮은 위계의 학습 메모 */
export const note = style({
  color: vars.color.muted,
  fontSize: '0.8125rem',
  lineHeight: 1.6,
});
