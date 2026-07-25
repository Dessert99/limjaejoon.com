/** AlertDialog — 모달 스크림 + 화면 중앙 확인 패널 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { shadow } from '@/shared/styles/tokens';
import { keyframes, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

/** 스크림 진입 — 배경 차단 상태를 빠르게 인지시킨다 */
const overlayShow = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

/** 스크림 이탈 — 배경 차단이 해제됨을 짧게 보여준다 */
const overlayHide = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

/** 패널 진입 — 중앙 고정 위치를 유지한 채 살짝 커진다 */
const contentShow = keyframes({
  from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
  to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

/** 패널 이탈 — 확인 흐름이 끝났음을 짧게 줄어드는 움직임으로 표현한다 */
const contentHide = keyframes({
  from: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  to: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
});

/** 스크림 — 뷰포트를 덮어 뒤 페이지를 가리는 반투명 배경 */
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

/** 패널 — 화면 정중앙에 뜨는 확인 본문, 불투명 surface에 뜬 느낌을 주는 raise 그림자 */
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
    maxWidth: '28rem',
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

/** 헤더 — 제목과 설명을 의미 단위로 묶어 본문/액션과 분리한다 */
export const header = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x1' }),
]);

/** 제목 — 확인 대화 이름(aria-labelledby로 연결), 기본 h2 마진 제거 */
export const title = style({
  margin: 0,
  fontSize: '1.125rem',
  color: vars.color.fg.neutral,
});

/** 설명 — 결과를 알리는 보조 문구(aria-describedby로 연결), 약하게 죽인 색 */
export const description = style({
  margin: 0,
  color: vars.color.fg.muted,
});

/** 푸터 — 액션 버튼을 확인 흐름의 마지막 영역으로 묶는다 */
export const footer = recipe({
  base: [
    sprinkles({
      display: 'flex',
      gap: 'x2',
    }),
    {
      width: '100%',
      minWidth: 0,
    },
  ],
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

/** Footer recipe variants */
export type FooterVariants = NonNullable<RecipeVariants<typeof footer>>;

/** 푸터 컨트롤 — 긴 액션 문구가 패널 폭 안에서 줄바꿈되도록 제한한다 */
export const footerControl = style({
  flex: '1 1 max-content',
  minWidth: 0,
  maxWidth: '100%',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  textAlign: 'center',
  selectors: {
    '&[data-alert-dialog-control]': {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'max-content',
      whiteSpace: 'normal',
    },
  },
});
