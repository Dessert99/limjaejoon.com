/** IconTile 스타일 — 정사각 아이콘 타일, hover 시 절제된 surface 강조 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 아이콘 링크 타일 — 크기·아이콘 크기·색 전환은 연출이라 style, 정렬은 sprinkles */
export const tile = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    r: 'control',
  }),
  {
    width: vars.dimension.x10,
    height: vars.dimension.x10,
    fontSize: vars.typography.fontSize[20],
    color: vars.color.fg.muted,
    border: `1px solid ${vars.color.stroke.neutral}`,
    transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, border-color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, transform ${vars.motion.tactileLift.duration} ${vars.motion.tactileLift.easing}`,
    '@media': {
      '(hover: hover) and (pointer: fine)': {
        selectors: {
          '&:hover:not(:disabled)': {
            background: vars.color.bg.surfaceMuted,
            color: vars.color.fg.brand,
            borderColor: vars.color.stroke.brand,
          },
        },
      },
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)':
        {
          selectors: {
            '&:hover:not(:disabled)': {
              transform: 'translateY(-3px)',
            },
          },
        },
    },
    selectors: {
      '&:focus-visible': {
        outline: `2px solid ${vars.color.stroke.brand}`,
        outlineOffset: vars.dimension.x0_5,
      },
    },
  },
]);
