/** Toggle 버튼 — ghost 모양, on이면 accent 틴트(구조적 상태색) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 단일 on/off 버튼 — 눌림은 data-state="on"으로 표시 */
export const toggle = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 'x3',
    py: 'x2',
    r: 'r2',
    gap: 'x2',
  }),
  {
    cursor: 'pointer',
    background: 'transparent',
    color: vars.color.text,
    border: `1px solid ${vars.color.border}`,
    selectors: {
      '&[data-state="on"]': {
        background: `color-mix(in srgb, ${vars.color.accent} 16%, transparent)`,
        borderColor: vars.color.accent,
      },
    },
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
]);
