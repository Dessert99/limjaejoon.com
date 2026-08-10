/** GSAP 모션 값 — duration·ease·stagger 는 GSAP 이 소유한다(CSS 변수를 읽어 오지 않는다) */

/** 모션 값 한 벌 — 초 단위와 GSAP 이름 이징을 쓴다(CSS 토큰과 어휘를 겹치지 않게 둔다) */
export const MOTION = {
  smooth: 1.2,
  duration: {
    reveal: 0.8,
    cinematic: 1.2,
  },
  ease: {
    reveal: 'power4.out',
    cinematic: 'power2.inOut',
  },
  stagger: {
    step: 0.1,
    // amount 는 총 시차다 — 조각이 많아도 마지막 등장이 하염없이 밀리지 않게 자른다
    total: 0.8,
  },
} as const;

/** stagger 최대 단계 — 컴포넌트 사이 시차를 자르는 지점 */
export const STAGGER_MAX_STEPS = 8;

/** 컴포넌트 사이 시차 단계 — 조각 안쪽 시차는 GSAP stagger 가 따로 맡는다 */
export const staggerIndex = (index: number): number => {
  return Math.min(index, STAGGER_MAX_STEPS);
};
