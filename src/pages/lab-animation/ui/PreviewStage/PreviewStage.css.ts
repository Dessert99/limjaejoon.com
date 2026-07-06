/** PreviewStage — 데모 트랙과 키프레임 프리셋 정의. animation 값 7종은 CSS 변수로 주입받는다 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { keyframes, style, styleVariants } from '@vanilla-extract/css';

export const stage = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x3',
    p: 'x5',
    r: 'r2',
  }),
  {
    border: `1px solid ${vars.color.stroke.neutral}`,
    background: vars.color.bg.surface,
  },
]);

export const controls = style([
  sprinkles({ display: 'flex', alignItems: 'center', gap: 'x3' }),
]);

export const pauseLabel = style({
  color: vars.color.fg.muted,
  fontSize: '0.875rem',
});

/** 트랙 — 박스가 달리는 레인. 컨테이너로 만들어 이동 거리를 트랙 폭 기준으로 계산한다 */
export const track = style([
  sprinkles({ display: 'flex', alignItems: 'center', p: 'x3', r: 'r1' }),
  {
    minHeight: '5.5rem',
    background: vars.color.bg.canvas,
    overflow: 'hidden',
    containerType: 'inline-size',
  },
]);

/** 개념 노트 — 재생 모델(리마운트 vs play-state) 설명 */
export const note = style({
  color: vars.color.fg.muted,
  fontSize: '0.8125rem',
  lineHeight: 1.6,
});

// 키프레임 프리셋 — presets.ts의 cssText와 짝. 0%·100%의 opacity 1은 rest(반투명)와 대비를 만드는 fill-mode 관찰 장치
const slide = keyframes({
  from: { opacity: 1, transform: 'translateX(0)' },
  // 100cqw=트랙 폭, 100%=박스 자신 폭 — 레이아웃이 바뀌어도 항상 끝까지 달린다
  to: { opacity: 1, transform: 'translateX(calc(100cqw - 100%))' },
});

const bounce = keyframes({
  '0%': { opacity: 1, transform: 'translateY(0)' },
  '30%': { transform: 'translateY(-1.25rem)' },
  '50%': { transform: 'translateY(0)' },
  '70%': { transform: 'translateY(-0.5rem)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const pulse = keyframes({
  '0%': { opacity: 1, transform: 'scale(1)' },
  '50%': { transform: 'scale(1.35)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const spin = keyframes({
  from: { opacity: 1, transform: 'rotate(0deg)' },
  to: { opacity: 1, transform: 'rotate(360deg)' },
});

// 데모 박스 공통 — rest는 반투명, 재생값은 전부 var()라서 조작 즉시 반영된다
const boxBase = style({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: vars.radius.r1,
  background: vars.color.bg.brand,
  opacity: 0.35,
  animationDuration: 'var(--lab-duration)',
  animationTimingFunction: 'var(--lab-timing)',
  animationDelay: 'var(--lab-delay)',
  animationIterationCount: 'var(--lab-iteration-count)',
  animationDirection: 'var(--lab-direction)',
  animationFillMode: 'var(--lab-fill-mode)',
  animationPlayState: 'var(--lab-play-state)',
});

/** 프리셋별 키프레임 연결 — 어떤 장면을 연기할지는 클래스가 정한다 */
export const box = styleVariants({
  slide: [boxBase, { animationName: slide }],
  bounce: [boxBase, { animationName: bounce }],
  pulse: [boxBase, { animationName: pulse }],
  spin: [boxBase, { animationName: spin }],
});
