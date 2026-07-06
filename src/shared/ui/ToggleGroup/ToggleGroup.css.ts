/** ToggleGroup 분절 버튼 — 선택 항목은 accent 틴트 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 가로 묶음 — 항목 간격만 */
export const root = style([sprinkles({ display: 'inline-flex', gap: 'x1' })]);

/** 항목 버튼 — on이면 accent 틴트 + 테두리 강조 */
export const item = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 'x3',
    py: 'x2',
    r: 'r2',
  }),
  {
    cursor: 'pointer',
    background: 'transparent',
    color: vars.color.fg.neutral,
    border: `1px solid ${vars.color.stroke.neutral}`,
    selectors: {
      '&[data-state="on"]': {
        background: `color-mix(in srgb, ${vars.color.bg.brand} 16%, transparent)`,
        borderColor: vars.color.stroke.brand,
      },
    },
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
]);
