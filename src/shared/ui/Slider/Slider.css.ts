/** Slider 트랙·레인지·썸 — 가로 범위 입력 연출. 치수는 스케일 밖이라 style()에 직접 둔다 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 루트 — 썸을 세로 중앙에 놓는 정렬 컨테이너, 터치 드래그가 스크롤로 새지 않게 막는다 */
export const root = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '1.25rem',
  touchAction: 'none',
  userSelect: 'none',
  cursor: 'pointer',
});

/** 트랙 — 전체 범위를 나타내는 얇은 바 */
export const track = style({
  position: 'relative',
  flexGrow: 1,
  height: '0.25rem',
  borderRadius: '9999px',
  background: vars.color.stroke.neutral,
});

/** 레인지 — 현재 값까지 채워지는 구간, 위치는 Radix가 인라인으로 계산 */
export const range = style({
  position: 'absolute',
  height: '100%',
  borderRadius: '9999px',
  background: vars.color.bg.brand,
});

/** 썸 — 드래그 손잡이, 키보드 포커스 링 표시 */
export const thumb = style({
  display: 'block',
  width: '1rem',
  height: '1rem',
  borderRadius: '9999px',
  border: `1px solid ${vars.color.stroke.brand}`,
  background: vars.color.bg.canvas,
  ':focus-visible': {
    outline: `2px solid ${vars.color.stroke.brand}`,
    outlineOffset: '2px',
  },
});
