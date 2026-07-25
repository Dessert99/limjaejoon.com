/** Select — 폼 셀렉트 트리거 + 옵션 패널·항목 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { finish, shadow } from '@/shared/styles/tokens';
import { style } from '@vanilla-extract/css';

/** 트리거 — 리세스 계기판: inset 그림자로 파인 표면, 값 텍스트는 브랜드색 */
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
    // overflow 클립 없이는 iconWell의 각진 모서리가 트리거의 둥근 모서리 밖으로 삐져나온다
    overflow: 'hidden',
    boxShadow: finish.inset,
    color: vars.color.fg.brand,
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
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
]);

/** 아이콘 웰 — 트리거 값 영역과 좌측 보더로 분리된 셰브론 자리, 트리거 hover 시에만 강조된다 */
export const iconWell = style({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  color: vars.color.fg.muted,
  borderLeft: `1px solid ${vars.color.stroke.muted}`,
  paddingInline: vars.dimension.x3,
  // 트리거의 py(x2)·px(x3) 만큼 마이너스 마진을 줘 well이 트리거 안쪽 테두리까지 꽉 차게 만든다
  marginBlock: `calc(-1 * ${vars.dimension.x2})`,
  marginRight: `calc(-1 * ${vars.dimension.x3})`,
  transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
  selectors: {
    [`${trigger}[data-disabled] &`]: {
      color: vars.color.fg.disabled,
    },
  },
  '@media': {
    '(hover: hover) and (pointer: fine)': {
      selectors: {
        [`${trigger}:not([data-disabled]):hover &`]: {
          background: vars.color.bg.surfaceMuted,
          color: vars.color.fg.brand,
        },
      },
    },
    'not all and (hover: hover) and (pointer: fine)': {
      selectors: {
        [`${trigger}:not([data-disabled]):active &`]: {
          background: vars.color.bg.surfaceMuted,
          color: vars.color.fg.brand,
        },
      },
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

/** 패널 — 옵션 목록을 담는 불투명 surface, 뜬 느낌을 주는 raise 그림자 */
export const content = style([
  sprinkles({ p: 'x1', r: 'r2' }),
  {
    minWidth: '10rem',
    background: vars.color.bg.surface,
    border: `1px solid ${vars.color.stroke.muted}`,
    boxShadow: shadow.raise,
    color: vars.color.fg.neutral,
  },
]);

/** 항목 — role="option" 한 줄, highlighted·selected(checked)·disabled 상태를 배치 */
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
        background: vars.color.bg.surfaceMuted,
      },
      '&[data-state="checked"]': {
        color: vars.color.fg.brand,
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
