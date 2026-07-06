/** Select — 폼 셀렉트 트리거 + 옵션 패널·항목 (정적; 그림자·모션·스크롤버튼은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 트리거 — 현재 값(또는 placeholder)을 보이는 버튼, placeholder는 약한 색 */
export const trigger = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'x2',
    px: 'x3',
    py: 'x2',
    r: 'r2',
  }),
  {
    minWidth: '10rem',
    background: vars.color.bg.surface,
    border: `1px solid ${vars.color.stroke.neutral}`,
    color: vars.color.fg.neutral,
    font: 'inherit',
    cursor: 'pointer',
    outline: 'none',
    selectors: {
      '&[data-placeholder]': { color: vars.color.fg.muted },
    },
  },
]);

/** 패널 — 옵션 목록을 담는 불투명 surface 카드 */
export const content = style([
  sprinkles({ p: 'x1', r: 'r2' }),
  {
    minWidth: '10rem',
    background: vars.color.bg.surface,
    border: `1px solid ${vars.color.stroke.neutral}`,
  },
]);

/** 항목 — role="option" 한 줄, 포커스(data-highlighted) 시 accent 배경, 선택 표식은 우측 */
export const item = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'x2',
    px: 'x2',
    py: 'x1_5',
    r: 'r1',
  }),
  {
    color: vars.color.fg.neutral,
    cursor: 'pointer',
    outline: 'none',
    userSelect: 'none',
    selectors: {
      '&[data-highlighted]': {
        background: vars.color.bg.brand,
        color: vars.color.fg.onBrand,
      },
      '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
]);
