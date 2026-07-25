/** Toggle 상태 칩 — 알약형 + 좌측 인디케이터 점(::before)으로 Button과 다른 언어를 쓴다 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { shadow } from '@/shared/styles/tokens';
import { style } from '@vanilla-extract/css';

/** 단일 on/off 칩 — data-state="on"이 활성, ::before가 좌측 인디케이터 점 */
export const toggle = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 'x4',
    py: 'x2',
    r: 'pill',
    gap: 'x2',
  }),
  {
    cursor: 'pointer',
    background: 'transparent',
    color: vars.color.fg.muted,
    fontFamily: 'inherit',
    border: `1px solid ${vars.color.stroke.neutral}`,
    transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, border-color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, transform ${vars.motion.tactilePress.duration} ${vars.motion.tactilePress.easing}`,
    selectors: {
      // 인디케이터 점 — off는 테두리만(hollow), 크기는 sprinkles 밖이라 style()에 둔다
      '&::before': {
        content: '""',
        display: 'inline-block',
        width: vars.dimension.x2,
        height: vars.dimension.x2,
        borderRadius: vars.radius.pill,
        border: `1px solid ${vars.color.stroke.neutral}`,
        background: 'transparent',
        transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, border-color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, box-shadow ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
      },
      '&[data-state="on"]': {
        background: vars.color.bg.brandWeak,
        borderColor: vars.color.stroke.brand,
        color: vars.color.fg.brand,
        boxShadow: shadow.press,
      },
      // 활성 점 — 채움 + 부드러운 링(브랜드색 저채도 확산)
      '&[data-state="on"]::before': {
        background: vars.color.bg.brand,
        borderColor: 'transparent',
        boxShadow: `0 0 0 3px color-mix(in srgb, ${vars.color.bg.brand} 24%, transparent)`,
      },
      '&:is(:disabled, [data-disabled])': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      '&:focus-visible': {
        outline: `2px solid ${vars.color.stroke.brand}`,
        outlineOffset: vars.dimension.x0_5,
      },
    },
    '@media': {
      '(hover: hover) and (pointer: fine)': {
        selectors: {
          '&:hover:not(:disabled):not([data-disabled])': {
            borderColor: vars.color.stroke.brand,
            color: vars.color.fg.neutral,
          },
        },
      },
      '(prefers-reduced-motion: no-preference)': {
        selectors: {
          '&:active:not(:disabled):not([data-disabled])': {
            transform: 'scale(0.97)',
          },
        },
      },
      '(prefers-reduced-motion: reduce)': {
        transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, border-color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
      },
    },
  },
]);
