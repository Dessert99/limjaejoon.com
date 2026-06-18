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
    gap: '8',
    px: '12',
    py: '8',
    r: 'md',
  }),
  {
    minWidth: '10rem',
    background: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
    color: vars.color.text,
    font: 'inherit',
    cursor: 'pointer',
    outline: 'none',
    selectors: {
      '&[data-placeholder]': { color: vars.color.muted },
    },
  },
]);

/** 패널 — 옵션 목록을 담는 불투명 surface 카드 */
export const content = style([
  sprinkles({ p: '4', r: 'md' }),
  {
    minWidth: '10rem',
    background: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
  },
]);

/** 항목 — role="option" 한 줄, 포커스(data-highlighted) 시 accent 배경, 선택 표식은 우측 */
export const item = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8',
    px: '8',
    py: '6',
    r: 'sm',
  }),
  {
    color: vars.color.text,
    cursor: 'pointer',
    outline: 'none',
    userSelect: 'none',
    selectors: {
      '&[data-highlighted]': {
        background: vars.color.accent,
        color: vars.color.accentForeground,
      },
      '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    },
  },
]);
