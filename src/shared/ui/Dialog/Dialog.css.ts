/** Dialog — 일반 모달 스크림 + 화면 중앙 패널 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { shadow } from '@/shared/styles/tokens';
import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

/** 스크림 진입 — 페이지가 모달 상태로 전환됨을 보여준다 */
const overlayShow = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

/** 스크림 이탈 — 모달 상태가 해제됨을 짧게 보여준다 */
const overlayHide = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

/** 패널 진입 — 중앙 위치를 유지하면서 부드럽게 나타난다 */
const contentShow = keyframes({
  from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
  to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

/** 패널 이탈 — 닫힘 상태 전환을 opacity와 scale로만 표현한다 */
const contentHide = keyframes({
  from: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  to: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
});

/** 스크림 — 뷰포트를 덮어 뒤 페이지와 모달을 분리한다 */
export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  background: vars.color.bg.overlay,
  selectors: {
    '&[data-state="open"]': {
      animation: `${overlayShow} ${vars.motion.overlayEnter.duration} ${vars.motion.overlayEnter.easing}`,
    },
    '&[data-state="closed"]': {
      animation: `${overlayHide} ${vars.motion.overlayExit.duration} ${vars.motion.overlayExit.easing}`,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

/** 패널 — 일반 모달 본문을 담는 중앙 surface, 뜬 느낌을 주는 raise 그림자 */
export const content = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x3',
    p: 'x6',
    r: 'r3',
  }),
  {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: 51,
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: vars.container.dialog,
    maxHeight: 'calc(100dvh - 2rem)',
    overflowY: 'auto',
    background: vars.color.bg.surface,
    border: `1px solid ${vars.color.stroke.neutral}`,
    boxShadow: shadow.raise,
    color: vars.color.fg.neutral,
    selectors: {
      '&[data-state="open"]': {
        animation: `${contentShow} ${vars.motion.overlayEnter.duration} ${vars.motion.overlayEnter.easing}`,
      },
      '&[data-state="closed"]': {
        animation: `${contentHide} ${vars.motion.overlayExit.duration} ${vars.motion.overlayExit.easing}`,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },
  },
]);

/** 헤더 — 제목과 설명을 본문보다 앞선 의미 영역으로 묶는다 */
export const header = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x1' }),
]);

/** 제목 — dialog 이름으로 aria-labelledby에 연결된다 */
export const title = style({
  margin: 0,
  fontSize: vars.typography.fontSize[20],
  color: vars.color.fg.neutral,
});

/** 설명 — dialog의 목적을 aria-describedby로 보조한다 */
export const description = style({
  margin: 0,
  color: vars.color.fg.muted,
});

/** 본문 — 폼이나 상세 내용을 header/footer와 분리한다 */
export const body = style({
  minWidth: 0,
  color: vars.color.fg.neutral,
});

/** 푸터 기본 class — direct child 버튼 폭을 footer 규칙으로 제어한다 */
const footerBase = style([
  sprinkles({
    display: 'flex',
    gap: 'x2',
  }),
  {
    width: '100%',
    minWidth: 0,
  },
]);

/** 푸터 — 일반 모달 액션 버튼을 natural 또는 single로 배치한다 */
export const footer = recipe({
  base: footerBase,
  variants: {
    layout: {
      natural: {
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
      },
      single: {
        flexDirection: 'column',
        alignItems: 'stretch',
      },
    },
  },
  defaultVariants: {
    layout: 'natural',
  },
});

/** footer direct child — Button 기본 nowrap/shrink 규칙보다 Dialog footer 의미를 우선한다 */
globalStyle(`${footerBase} > *[class]`, {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 'max-content',
  minWidth: 0,
  maxWidth: '100%',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  textAlign: 'center',
});

/** Footer recipe variants */
export type FooterVariants = NonNullable<RecipeVariants<typeof footer>>;
