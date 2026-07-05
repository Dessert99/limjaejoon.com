/** 베지어 제어점 좌표 클램프 — 스펙 제약과 에디터 표시 범위 */

/** 에디터 y축 하한 — 아래로 튀는(anticipation) 곡선 표현 한계 */
export const BEZIER_Y_MIN = -0.5;

/** 에디터 y축 상한 — 위로 튀는(overshoot) 곡선 표현 한계 */
export const BEZIER_Y_MAX = 1.5;

/** 소수점 2자리 반올림 — 0.01 미만 차이는 곡선에서 감지 불가, 코드 표시도 깔끔해진다 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** x는 스펙상 [0,1] 필수(시간축은 되감기 불가), y는 오버슈트를 위해 [-0.5, 1.5] 허용 */
export function clampBezierPoint(x: number, y: number): [number, number] {
  const clampedX = Math.min(1, Math.max(0, x));
  const clampedY = Math.min(BEZIER_Y_MAX, Math.max(BEZIER_Y_MIN, y));
  return [round2(clampedX), round2(clampedY)];
}
