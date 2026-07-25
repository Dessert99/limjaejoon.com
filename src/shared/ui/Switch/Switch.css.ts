/** Switch 트랙·썸 — off는 disabled, on은 brand. 썸 위치만 data-state로 이동 */
import { vars } from '@/shared/styles/theme.css';
import { finish } from '@/shared/styles/tokens';
import { style } from '@vanilla-extract/css';

/** 트랙 — 치수/위치는 sprinkles 밖이라 style()에 직접 둔다 */
export const root = style({
  position: 'relative',
  width: '2.5rem',
  height: '1.5rem',
  flexShrink: 0,
  padding: 0,
  border: `1px solid ${vars.color.stroke.neutral}`,
  borderRadius: vars.radius.pill,
  background: vars.color.bg.surfaceMuted,
  cursor: 'pointer',
  transition: `background ${vars.motion.controlFeedback.duration} ${vars.motion.controlFeedback.easing}`,
  selectors: {
    '&[data-state="checked"]': { background: vars.color.bg.brand },
  },
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
});

/** 손잡이 — on이면 오른쪽으로 슬라이드(보더 1px 포함 좌우 2px 여백), 위치 전환은 no-preference에서만 애니메이션 */
export const thumb = style({
  display: 'block',
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: vars.radius.pill,
  background: vars.color.bg.surface,
  boxShadow: finish.inset,
  transform: 'translateX(1px)',
  willChange: 'transform',
  selectors: {
    '&[data-state="checked"]': {
      transform: 'translateX(calc(2.5rem - 1.25rem - 3px))',
    },
  },
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      transition: `transform ${vars.motion.controlSlide.duration} ${vars.motion.controlSlide.easing}`,
    },
  },
});
