/** ToggleGroup 분절 버튼 — 리세스 트랙 위를 미끄러지는 인디케이터로 선택을 표시 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { finish } from '@/shared/styles/tokens';
import { style } from '@vanilla-extract/css';

/** 리세스 트랙 — 등폭 grid, item 개수를 몰라도 gridAutoColumns로 균등 분할 */
export const root = style([
  sprinkles({ p: 'x1', r: 'pill', bg: 'surfaceMuted' }),
  {
    position: 'relative',
    display: 'inline-grid',
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr',
    boxShadow: finish.inset,
  },
]);

/** 슬라이드 인디케이터 — Root가 --gt-index·--gt-count로 위치·너비를 주입(decorative span) */
export const indicator = style({
  position: 'absolute',
  // Root의 padding(x1)만큼 인셋해 grid item이 사는 content box에 맞춘다 — 안 그러면 padding box 기준으로 밀려서 어긋난다
  top: vars.dimension.x1,
  bottom: vars.dimension.x1,
  left: vars.dimension.x1,
  width: `calc((100% - (2 * ${vars.dimension.x1})) / var(--gt-count, 1))`,
  borderRadius: vars.radius.pill,
  background: vars.color.bg.brand,
  boxShadow: finish.inset,
  pointerEvents: 'none',
  zIndex: 0,
  transform: 'translateX(calc(var(--gt-index, 0) * 100%))',
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      transition: `transform ${vars.motion.controlSlide.duration} ${vars.motion.controlSlide.easing}`,
    },
  },
});

/** 항목 버튼 — 투명 텍스트 버튼, on이면 텍스트만 onBrand(배경은 인디케이터가 담당) */
export const item = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 'x3',
    py: 'x2',
    r: 'pill',
  }),
  {
    position: 'relative',
    zIndex: 1,
    cursor: 'pointer',
    background: 'transparent',
    color: vars.color.fg.muted,
    fontFamily: 'inherit',
    border: 'none',
    transition: `color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
    selectors: {
      '&[data-state="on"]': {
        color: vars.color.fg.onBrand,
      },
      // multiple 타입은 단일 위치 인디케이터가 성립하지 않는다 — 항목마다 자체 배경으로 대체
      [`${root}[data-toggle-type="multiple"] &[data-state="on"]`]: {
        background: vars.color.bg.brand,
        boxShadow: finish.inset,
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
          // 선택된 항목은 onBrand 유지 — hover 색은 off 항목에만(선택 항목 hover 시 대비 붕괴 방지)
          '&:hover:not(:disabled):not([data-disabled]):not([data-state="on"])':
            {
              color: vars.color.fg.neutral,
            },
        },
      },
    },
  },
]);
