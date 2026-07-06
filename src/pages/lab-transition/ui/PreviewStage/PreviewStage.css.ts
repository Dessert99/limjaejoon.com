/** PreviewStage — 트랙 두 줄과 데모 박스. transition 값 4종은 CSS 변수로 주입받는다 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const stage = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x3',
    p: 'x5',
    r: 'r2',
  }),
  { border: `1px solid ${vars.color.stroke.neutral}`, background: vars.color.bg.surface },
]);

export const controls = style([
  sprinkles({ display: 'flex', alignItems: 'center', gap: 'x3' }),
]);

export const baselineLabel = style({
  color: vars.color.fg.muted,
  fontSize: '0.875rem',
});

/** 트랙 — 박스가 달리는 레인. 컨테이너로 만들어 이동 거리를 트랙 폭 기준으로 계산한다 */
export const track = style([
  sprinkles({ display: 'flex', alignItems: 'center', p: 'x3', r: 'r1' }),
  {
    minHeight: '4.5rem',
    background: vars.color.bg.canvas,
    overflow: 'hidden',
    containerType: 'inline-size',
  },
]);

// 데모 박스 공통 — 연출값은 전부 var()라서 조작 즉시 다음 재생에 반영된다
const boxBase = style({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: vars.radius.r1,
  background: vars.color.bg.brand,
  transitionProperty: 'var(--lab-property)',
  transitionDuration: 'var(--lab-duration)',
  transitionTimingFunction: 'var(--lab-timing)',
  transitionDelay: 'var(--lab-delay)',
});

/** 프로퍼티별 from→to 연출 — data-run이 A/B 상태 스위치 */
export const box = styleVariants({
  'translate-x': [
    boxBase,
    {
      selectors: {
        // 100cqw=트랙 폭, 100%=박스 자신 폭 — 레이아웃이 바뀌어도 항상 끝까지 달린다
        '&[data-run="true"]': {
          transform: 'translateX(calc(100cqw - 100%))',
        },
      },
    },
  ],
  scale: [
    boxBase,
    {
      transform: 'scale(0.6)',
      selectors: { '&[data-run="true"]': { transform: 'scale(1.3)' } },
    },
  ],
  rotate: [
    boxBase,
    { selectors: { '&[data-run="true"]': { transform: 'rotate(180deg)' } } },
  ],
  opacity: [
    boxBase,
    { selectors: { '&[data-run="true"]': { opacity: 0.15 } } },
  ],
  'background-color': [
    boxBase,
    { selectors: { '&[data-run="true"]': { background: vars.color.bg.brand } } },
  ],
});
