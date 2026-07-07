/** Select — 폼 셀렉트 트리거 + 옵션 패널·항목 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 트리거 — 현재 값·placeholder·invalid·disabled 상태를 드러내는 combobox 버튼 */
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
    transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, border-color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, outline-color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
    selectors: {
      '&[data-placeholder]': { color: vars.color.fg.muted },
      '&[data-invalid]': {
        borderColor: vars.color.stroke.critical,
      },
      '&[data-disabled]': {
        background: vars.color.bg.disabled,
        color: vars.color.fg.disabled,
        cursor: 'not-allowed',
      },
      '&:focus-visible': {
        outline: `2px solid ${vars.color.stroke.brand}`,
        outlineOffset: vars.dimension.x0_5,
      },
      '&[data-invalid]:focus-visible': {
        outlineColor: vars.color.stroke.critical,
      },
    },
    '@media': {
      '(hover: hover) and (pointer: fine)': {
        selectors: {
          '&:not([data-disabled]):hover': {
            background: vars.color.bg.surfaceMuted,
          },
        },
      },
      'not all and (hover: hover) and (pointer: fine)': {
        selectors: {
          '&:not([data-disabled]):active': {
            background: vars.color.bg.surfaceMuted,
          },
        },
      },
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
]);

/** 패널 — 옵션 목록을 담는 불투명 surface */
export const content = style([
  sprinkles({ p: 'x1', r: 'r2' }),
  {
    minWidth: '10rem',
    background: vars.color.bg.surface,
    border: `1px solid ${vars.color.stroke.neutral}`,
    color: vars.color.fg.neutral,
  },
]);

/** 항목 — role="option" 한 줄, highlighted·disabled 상태와 선택 표식을 배치 */
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
    transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
    selectors: {
      '&[data-highlighted]': {
        background: vars.color.bg.brand,
        color: vars.color.fg.onBrand,
      },
      '&[data-disabled]': { opacity: 0.5, cursor: 'not-allowed' },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
]);
