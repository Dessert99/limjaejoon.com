/** PreviewStage — 트랙 두 줄과 데모 박스. transition 값 4종은 CSS 변수로 주입받는다 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const stage = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '12',
    p: '20',
    r: 'md',
  }),
  { border: `1px solid ${vars.color.border}`, background: vars.color.surface },
]);

export const controls = style([
  sprinkles({ display: 'flex', alignItems: 'center', gap: '12' }),
]);

export const baselineLabel = style({
  color: vars.color.muted,
  fontSize: '0.875rem',
});

/** 트랙 — 박스가 달리는 레인, 이동 데모가 잘리지 않게 여유 폭 확보 */
export const track = style([
  sprinkles({ display: 'flex', alignItems: 'center', p: '12', r: 'sm' }),
  {
    minHeight: '4.5rem',
    background: vars.color.background,
    overflow: 'hidden',
  },
]);

// 데모 박스 공통 — 연출값은 전부 var()라서 조작 즉시 다음 재생에 반영된다
const boxBase = style({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: vars.radius.sm,
  background: vars.color.accent,
  transitionProperty: 'var(--lab-property)',
  transitionDuration: 'var(--lab-duration)',
  transitionTimingFunction: 'var(--lab-timing)',
  transitionDelay: 'var(--lab-delay)',
});

/** 프로퍼티별 from→to 연출 — data-run이 A/B 상태 스위치 */
export const box = styleVariants({
  'translate-x': [
    boxBase,
    { selectors: { '&[data-run="true"]': { transform: 'translateX(14rem)' } } },
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
    { selectors: { '&[data-run="true"]': { background: vars.color.text } } },
  ],
});
