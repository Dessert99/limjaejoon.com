/** Switch 트랙·썸 — off는 border, on은 accent. 썸 위치만 data-state로 이동 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 트랙 — 치수/위치는 sprinkles 밖이라 style()에 직접 둔다 */
export const root = style({
  position: 'relative',
  width: '2.5rem',
  height: '1.5rem',
  flexShrink: 0,
  padding: 0,
  border: 'none',
  borderRadius: '9999px',
  background: vars.color.border,
  cursor: 'pointer',
  transition: 'background 120ms ease',
  selectors: {
    '&[data-state="checked"]': { background: vars.color.accent },
  },
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
});

/** 손잡이 — on이면 오른쪽으로 슬라이드(트랙 폭 - 썸 - 좌우 2px) */
export const thumb = style({
  display: 'block',
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: '9999px',
  background: vars.color.background,
  transform: 'translateX(2px)',
  transition: 'transform 120ms ease',
  willChange: 'transform',
  selectors: {
    '&[data-state="checked"]': {
      transform: 'translateX(calc(2.5rem - 1.25rem - 2px))',
    },
  },
});
