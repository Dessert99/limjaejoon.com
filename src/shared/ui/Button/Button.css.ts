/** Button 시각 변형 — SEED ActionButton 구조를 웹앱 토큰으로 재해석한다 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { createVar, keyframes, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

/** Button content 간격을 size/layout compound variant 가 주입한다 */
const contentGap = createVar();

/** withText icon slot 크기를 size/layout compound variant 가 주입한다 */
const affixIconSize = createVar();

/** iconOnly icon slot 크기를 size/layout compound variant 가 주입한다 */
const iconSize = createVar();

/** loading indicator 회전 — reduced motion 에서는 정지시킨다 */
const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

/** 공통 base — 상태와 slot layer 의 기준점 */
const base = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    r: 'control',
  }),
  {
    position: 'relative',
    boxSizing: 'border-box',
    cursor: 'pointer',
    flexShrink: 0,
    fontFamily: 'inherit',
    fontWeight: vars.typography.fontWeight.bold,
    border: '1px solid transparent',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, border-color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, outline-color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
    selectors: {
      '&:is(:disabled, [data-disabled])': {
        cursor: 'not-allowed',
      },
      '&[data-loading]': {
        cursor: 'progress',
      },
      '&:focus-visible': {
        outline: `2px solid ${vars.color.stroke.brand}`,
        outlineOffset: vars.dimension.x0_5,
      },
    },
  },
]);

/** Button 내용 layer — loading 중에도 접근성 이름과 크기를 유지하려 opacity만 낮춘다 */
export const content = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    gap: contentGap,
    minWidth: 0,
    transition: `opacity ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
    selectors: {
      [`${base}[data-loading] &`]: {
        opacity: 0,
      },
    },
  },
]);

/** loading layer — content 크기는 유지하고 spinner만 중앙에 겹친다 */
export const loadingLayer = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
]);

/** loading spinner — reduced motion 에서는 정적 mark 로 둔다 */
export const spinner = style({
  width: '1em',
  height: '1em',
  borderRadius: vars.radius.pill,
  border: '2px solid currentColor',
  borderRightColor: 'transparent',
  animation: `${spin} ${vars.duration.d6} linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

/** prefix icon slot — 텍스트 앞 아이콘 */
export const prefixIcon = style({
  display: 'inline-flex',
  width: affixIconSize,
  height: affixIconSize,
  flexShrink: 0,
});

/** suffix icon slot — 텍스트 뒤 아이콘 */
export const suffixIcon = style({
  display: 'inline-flex',
  width: affixIconSize,
  height: affixIconSize,
  flexShrink: 0,
});

/** iconOnly 전용 icon slot */
export const icon = style({
  display: 'inline-flex',
  width: iconSize,
  height: iconSize,
  flexShrink: 0,
});

/** variant×size×layout 매트릭스 — 색은 semantic token, 구조는 recipe */
export const button = recipe({
  base,
  variants: {
    variant: {
      brandSolid: {
        background: vars.color.bg.brand,
        color: vars.color.fg.onBrand,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { background: vars.color.bg.brandPressed },
          },
          'not all and (hover: hover) and (pointer: fine)': {
            ':active': { background: vars.color.bg.brandPressed },
          },
        },
      },
      neutralSolid: {
        background: vars.color.fg.neutral,
        color: vars.color.bg.canvas,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { background: vars.color.fg.muted },
          },
          'not all and (hover: hover) and (pointer: fine)': {
            ':active': { background: vars.color.fg.muted },
          },
        },
      },
      neutralWeak: {
        background: vars.color.bg.surfaceMuted,
        color: vars.color.fg.neutral,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { background: vars.color.bg.disabled },
          },
          'not all and (hover: hover) and (pointer: fine)': {
            ':active': { background: vars.color.bg.disabled },
          },
        },
      },
      criticalSolid: {
        background: vars.color.bg.critical,
        color: vars.color.fg.onBrand,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { background: vars.color.stroke.critical },
          },
          'not all and (hover: hover) and (pointer: fine)': {
            ':active': { background: vars.color.stroke.critical },
          },
        },
      },
      brandOutline: {
        background: 'transparent',
        borderColor: vars.color.stroke.neutral,
        color: vars.color.fg.brand,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { background: vars.color.bg.brandWeak },
          },
          'not all and (hover: hover) and (pointer: fine)': {
            ':active': { background: vars.color.bg.brandWeak },
          },
        },
      },
      neutralOutline: {
        background: 'transparent',
        borderColor: vars.color.stroke.neutral,
        color: vars.color.fg.neutral,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { background: vars.color.bg.surfaceMuted },
          },
          'not all and (hover: hover) and (pointer: fine)': {
            ':active': { background: vars.color.bg.surfaceMuted },
          },
        },
      },
      ghost: {
        background: 'transparent',
        color: vars.color.fg.neutral,
        '@media': {
          '(hover: hover) and (pointer: fine)': {
            ':hover': { background: vars.color.bg.surfaceMuted },
          },
          'not all and (hover: hover) and (pointer: fine)': {
            ':active': { background: vars.color.bg.surfaceMuted },
          },
        },
      },
    },
    size: {
      xsmall: { height: vars.dimension.x8, fontSize: vars.typography.fontSize[12] },
      small: { height: vars.dimension.x10, fontSize: vars.typography.fontSize[14] },
      medium: { height: vars.dimension.x12, fontSize: vars.typography.fontSize[14] },
      large: { height: vars.dimension.x16, fontSize: vars.typography.fontSize[16] },
    },
    layout: {
      withText: {},
      iconOnly: {},
    },
  },
  compoundVariants: [
    {
      variants: { size: 'xsmall', layout: 'withText' },
      style: {
        gap: vars.dimension.x1,
        paddingInline: vars.dimension.x3,
        paddingBlock: vars.dimension.x1_5,
        lineHeight: vars.typography.lineHeight.normal,
        vars: {
          [contentGap]: vars.dimension.x1,
          [affixIconSize]: vars.dimension.x3_5,
        },
      },
    },
    {
      variants: { size: 'small', layout: 'withText' },
      style: {
        gap: vars.dimension.x1,
        paddingInline: vars.dimension.x3_5,
        paddingBlock: vars.dimension.x2,
        lineHeight: vars.typography.lineHeight.normal,
        vars: {
          [contentGap]: vars.dimension.x1,
          [affixIconSize]: vars.dimension.x4,
        },
      },
    },
    {
      variants: { size: 'medium', layout: 'withText' },
      style: {
        gap: vars.dimension.x1_5,
        paddingInline: vars.dimension.x4,
        paddingBlock: vars.dimension.x2_5,
        lineHeight: vars.typography.lineHeight.normal,
        vars: {
          [contentGap]: vars.dimension.x1_5,
          [affixIconSize]: vars.dimension.x4,
        },
      },
    },
    {
      variants: { size: 'large', layout: 'withText' },
      style: {
        gap: vars.dimension.x2,
        paddingInline: vars.dimension.x5,
        paddingBlock: vars.dimension.x3_5,
        lineHeight: vars.typography.lineHeight.normal,
        vars: {
          [contentGap]: vars.dimension.x2,
          [affixIconSize]: vars.dimension.x5,
        },
      },
    },
    {
      variants: { size: 'xsmall', layout: 'iconOnly' },
      style: {
        width: vars.dimension.x8,
        padding: vars.dimension.x1_5,
        borderRadius: vars.radius.pill,
        vars: {
          [contentGap]: vars.dimension.none,
          [iconSize]: vars.dimension.x3_5,
        },
      },
    },
    {
      variants: { size: 'small', layout: 'iconOnly' },
      style: {
        width: vars.dimension.x10,
        padding: vars.dimension.x2,
        vars: {
          [contentGap]: vars.dimension.none,
          [iconSize]: vars.dimension.x4,
        },
      },
    },
    {
      variants: { size: 'medium', layout: 'iconOnly' },
      style: {
        width: vars.dimension.x12,
        padding: vars.dimension.x2_5,
        vars: {
          [contentGap]: vars.dimension.none,
          [iconSize]: vars.dimension.x5,
        },
      },
    },
    {
      variants: { size: 'large', layout: 'iconOnly' },
      style: {
        width: vars.dimension.x16,
        padding: vars.dimension.x3_5,
        vars: {
          [contentGap]: vars.dimension.none,
          [iconSize]: vars.dimension.x6,
        },
      },
    },
    {
      variants: { variant: 'brandSolid' },
      style: {
        selectors: {
          '&:is(:disabled, [data-disabled])': {
            background: vars.color.bg.disabled,
            color: vars.color.fg.disabled,
          },
          '&[data-loading]': {
            background: vars.color.bg.brandPressed,
          },
        },
      },
    },
    {
      variants: { variant: 'neutralSolid' },
      style: {
        selectors: {
          '&:is(:disabled, [data-disabled])': {
            background: vars.color.bg.disabled,
            color: vars.color.fg.disabled,
          },
          '&[data-loading]': {
            background: vars.color.fg.muted,
          },
        },
      },
    },
    {
      variants: { variant: 'criticalSolid' },
      style: {
        selectors: {
          '&:is(:disabled, [data-disabled])': {
            background: vars.color.bg.disabled,
            color: vars.color.fg.disabled,
          },
          '&[data-loading]': {
            background: vars.color.stroke.critical,
          },
        },
      },
    },
    {
      variants: { variant: 'neutralWeak' },
      style: {
        selectors: {
          '&:is(:disabled, [data-disabled])': {
            background: vars.color.bg.disabled,
            color: vars.color.fg.disabled,
          },
          '&[data-loading]': {
            background: vars.color.bg.disabled,
          },
        },
      },
    },
    {
      variants: { variant: 'brandOutline' },
      style: {
        selectors: {
          '&:is(:disabled, [data-disabled])': {
            background: 'transparent',
            borderColor: vars.color.stroke.muted,
            color: vars.color.fg.disabled,
          },
          '&[data-loading]': {
            background: vars.color.bg.brandWeak,
          },
        },
      },
    },
    {
      variants: { variant: 'neutralOutline' },
      style: {
        selectors: {
          '&:is(:disabled, [data-disabled])': {
            background: 'transparent',
            borderColor: vars.color.stroke.muted,
            color: vars.color.fg.disabled,
          },
          '&[data-loading]': {
            background: vars.color.bg.surfaceMuted,
          },
        },
      },
    },
    {
      variants: { variant: 'ghost' },
      style: {
        selectors: {
          '&:is(:disabled, [data-disabled])': {
            background: 'transparent',
            color: vars.color.fg.disabled,
          },
          '&[data-loading]': {
            background: vars.color.bg.surfaceMuted,
          },
        },
      },
    },
  ],
  defaultVariants: {
    variant: 'brandSolid',
    size: 'medium',
    layout: 'withText',
  },
});

/** recipe variant prop 타입 — Button props의 단일 출처 */
export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;
