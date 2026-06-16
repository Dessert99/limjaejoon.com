/** ToggleGroup 분절 버튼 — 선택 항목은 accent 틴트 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 가로 묶음 — 항목 간격만 */
export const root = style([sprinkles({ display: 'inline-flex', gap: '4' })]);

/** 항목 버튼 — on이면 accent 틴트 + 테두리 강조 */
export const item = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: '12',
    py: '8',
    r: 'md',
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
