/** BezierEditor — 곡선·보조선·핸들 연출. 크기·색 모두 시각 연출이라 style() 영역 */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** SVG 캔버스 — 정사각형 유지, 테마 표면 위에 얹는다 */
export const svg = style({
  width: '100%',
  maxWidth: '20rem',
  aspectRatio: '1',
  borderRadius: vars.radius.r2,
  border: `1px solid ${vars.color.stroke.neutral}`,
  background: vars.color.bg.surface,
  touchAction: 'none',
});

/** 단위 정사각형 — (0,0)→(1,1) 진행 영역 표시, 이 밖의 y가 오버슈트 */
export const unitArea = style({
  fill: vars.color.bg.canvas,
});

/** linear 대각선 — 기준 비교용 점선 */
export const baseline = style({
  stroke: vars.color.stroke.neutral,
  strokeWidth: 2,
  strokeDasharray: '4 4',
});

/** 끝점→제어점 연결선 — 핸들이 곡선의 어디를 당기는지 보여준다 */
export const arm = style({
  stroke: vars.color.stroke.muted,
  strokeWidth: 1.5,
});

/** 베지어 곡선 본체 */
export const curve = style({
  fill: 'none',
  stroke: vars.color.stroke.brand,
  strokeWidth: 3,
});

/** 드래그 핸들 — 포커스 링으로 키보드 조작 대상 표시 */
export const handle = style({
  fill: vars.color.bg.brand,
  cursor: 'grab',
  ':focus-visible': {
    outline: `2px solid ${vars.color.stroke.brand}`,
    outlineOffset: '2px',
  },
});
