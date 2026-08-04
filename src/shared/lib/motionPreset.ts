/** 모션 프리셋 — CSS 가 소유할 수 없는 값만 담는다(duration·easing 은 토큰이 단독 소유) */

/** stagger 최대 단계 — 항목이 많아도 마지막 등장이 하염없이 밀리지 않게 자르는 지점 */
export const STAGGER_MAX_STEPS = 8;

/** CSS 에 넘길 stagger 단계 — 지연 "값"이 아니라 배수만 넘겨 duration 소유권을 CSS 에 남긴다 */
export const staggerIndex = (index: number): number => {
  return Math.min(index, STAGGER_MAX_STEPS);
};
