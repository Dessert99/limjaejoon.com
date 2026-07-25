/** Accordion 디스클로저 — Radix measured height 위에 토큰 기반 motion 을 입힌다 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { keyframes, style } from '@vanilla-extract/css';

/** 펼침 애니메이션 — Radix 가 측정한 content height 를 CSS 보간값으로 사용한다 */
const accordionDown = keyframes({
  from: { height: 0, opacity: 0 },
  to: { height: 'var(--radix-accordion-content-height)', opacity: 1 },
});

/** 접힘 애니메이션 — 현재 측정 높이에서 0 으로 돌아간다 */
const accordionUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)', opacity: 1 },
  to: { height: 0, opacity: 0 },
});

/** 묶음 — 세로 스택 + 테두리로 감싼 카드, 라운드에 항목 모서리 클립 */
export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', r: 'r2' }),
  {
    border: `1px solid ${vars.color.stroke.neutral}`,
    overflow: 'hidden',
  },
]);

/** 항목 — 항목 사이 구분선(마지막 항목은 생략) */
export const item = style({
  borderBottom: `1px solid ${vars.color.stroke.neutral}`,
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
});

/** 헤더 — Radix h3의 기본 마진 제거 */
export const header = style({ margin: 0 });

/** prefix — 제목 앞에 놓는 보조 시각 요소 */
export const prefix = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: vars.color.fg.muted,
});

/** body — title/description 을 세로로 묶어 trigger 안의 주 텍스트 영역을 만든다 */
export const body = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x0_5' }),
  {
    minWidth: 0,
    flex: 1,
  },
]);

/** title — accordion item 의 핵심 라벨 */
export const title = style({
  color: vars.color.fg.neutral,
  fontWeight: vars.typography.fontWeight.semibold,
});

/** description — title 을 보조하는 짧은 설명 */
export const description = style({
  color: vars.color.fg.muted,
  fontSize: vars.typography.fontSize[14],
  lineHeight: vars.typography.lineHeight.normal,
});

/** 트리거 — 전폭 클릭 영역, 라벨 묶음과 상태 표식을 배치 */
export const trigger = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'x3',
    px: 'x4',
    py: 'x3',
  }),
  {
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: vars.color.fg.neutral,
    font: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    transition: `background ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
    selectors: {
      '&[data-state="open"]': {
        background: vars.color.bg.surfaceMuted,
      },
      '&:is(:disabled, [data-disabled])': {
        cursor: 'not-allowed',
        color: vars.color.fg.disabled,
      },
      '&:focus-visible': {
        outline: `2px solid ${vars.color.stroke.brand}`,
        outlineOffset: `calc(${vars.dimension.x0_5} * -1)`,
      },
    },
    '@media': {
      '(hover: hover) and (pointer: fine)': {
        ':hover': { background: vars.color.bg.surfaceMuted },
      },
      'not all and (hover: hover) and (pointer: fine)': {
        ':active': { background: vars.color.bg.surfaceMuted },
      },
    },
  },
]);

/** indicator — 고정 크기 박스 안에서 제자리 360도 회전으로 open 상태를 알려주는 장식 slot */
export const indicator = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: vars.dimension.x6,
  height: vars.dimension.x6,
  color: vars.color.fg.muted,
  transformOrigin: 'center',
  // 상태(open/closed)를 전달하는 값이라 회전 자체는 항상 유지하고, transition만 no-preference에서 게이트한다
  transition: `color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}`,
  selectors: {
    [`${trigger}[data-state="open"] &`]: {
      transform: 'rotate(360deg)',
      color: vars.color.fg.brand,
    },
    [`${trigger}:is(:disabled, [data-disabled]) &`]: {
      color: vars.color.fg.disabled,
    },
  },
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      transition: `color ${vars.motion.colorTransition.duration} ${vars.motion.colorTransition.easing}, transform ${vars.motion.tactileLift.duration} ${vars.motion.tactileLift.easing}`,
    },
  },
});

/** 패널 — Radix measured height 를 기준으로 열림/닫힘을 보간한다 */
export const content = style({
  overflow: 'hidden',
  color: vars.color.fg.neutral,
  selectors: {
    '&[data-state="open"]': {
      animation: `${accordionDown} ${vars.motion.controlFeedback.duration} ${vars.motion.controlFeedback.easing}`,
    },
    '&[data-state="closed"]': {
      animation: `${accordionUp} ${vars.motion.controlFeedback.duration} ${vars.motion.controlFeedback.easing}`,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

/** contentInner — height animation 에 padding 이 끼지 않도록 실제 본문 여백을 안쪽으로 분리한다 */
export const contentInner = style([
  sprinkles({ px: 'x4', py: 'x3' }),
  { color: vars.color.fg.neutral },
]);
