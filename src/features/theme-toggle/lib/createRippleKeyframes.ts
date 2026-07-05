/** 일렁이는 원형 확산의 polygon clip-path 키프레임 생성기 — 전환 중 JS가 돌지 않도록 사전 계산 */

/** 확산 원의 중심 좌표 — 뷰포트 기준(px) */
export interface RevealOrigin {
  x: number;
  y: number;
}

// 키프레임 장수 — 사이 보간은 브라우저(컴포지터) 몫이라 적어도 부드럽다
const FRAME_COUNT = 10;
// 꼭짓점 수 — 모든 프레임이 같아야 polygon끼리 네이티브 보간이 된다
const POINT_COUNT = 64;
// 출렁임 진폭 = 그 시점 기본 반지름의 %
const WOBBLE_RATIO = 0.25;
// 다각형 현(chord)이 원 안쪽으로 파이는 만큼의 여유 — 마지막 프레임 덮임 보장
const COVER_MARGIN = 2;

/** origin에서 radius까지 퍼지는 일렁이는 polygon 키프레임 배열(문자열)을 만든다 */
export const createRippleKeyframes = (
  origin: RevealOrigin,
  radius: number
): string[] => {
  const frames: string[] = [];
  for (let f = 0; f < FRAME_COUNT; f++) {
    const t = f / (FRAME_COUNT - 1);
    const baseRadius = radius * COVER_MARGIN * t;
    // sin(πt): 시작(점)과 끝(완전한 원)에선 0 — 중간에서만 출렁인다
    const amplitude = baseRadius * WOBBLE_RATIO * Math.sin(Math.PI * t);
    const points: string[] = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      const angle = (2 * Math.PI * i) / POINT_COUNT;
      // 저주파+고주파 sin 두 겹, 위상이 t를 따라 흘러 가장자리가 살아 움직인다
      const wobble =
        amplitude *
        (Math.sin(3 * angle + 8 * t) + 0.5 * Math.sin(7 * angle - 12 * t));
      const r = baseRadius + wobble;
      const x = (origin.x + r * Math.cos(angle)).toFixed(1);
      const y = (origin.y + r * Math.sin(angle)).toFixed(1);
      points.push(`${x}px ${y}px`);
    }
    frames.push(`polygon(${points.join(', ')})`);
  }
  return frames;
};
