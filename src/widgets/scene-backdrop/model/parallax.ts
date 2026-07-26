/** 파랄랙스 계산 — GSAP 에 넘길 값을 순수 함수로 뽑아 테스트 가능하게 둔다 */

/** matchMedia 가 확정한 조건 한 벌 */
export interface ParallaxConditions {
  isDesktop: boolean;
  reduceMotion: boolean;
}

/** 조건이 결정한 연출 설정 */
export interface ParallaxConfig {
  pin: boolean;
  travelRatio: number;
}

/** 조건별 연출 설정 — reduced-motion 은 null 이라 핀조차 걸지 않는다 */
export function resolveParallaxConfig(
  conditions: ParallaxConditions
): ParallaxConfig | null {
  // 이동만 끄고 핀을 남기면 정지 화면이 스크럽 거리만큼 붙잡혀 "먹통" 구간이 된다
  if (conditions.reduceMotion) {
    return null;
  }

  // 세로로 긴 모바일에서 같은 비율로 밀면 실루엣이 과하게 잘린다
  return { pin: true, travelRatio: conditions.isDesktop ? 0.6 : 0.25 };
}

/** 겹 하나의 수평 이동 거리(px) — depth 차이가 곧 깊이감이다 */
export function layerShift(
  depth: number,
  progress: number,
  travel: number
): number {
  return depth * progress * travel;
}
