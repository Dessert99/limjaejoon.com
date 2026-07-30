/** 모션 프리셋 — CSS 가 소유할 수 없는 값만 담는다(duration·easing 은 토큰이 단독 소유) */

/** IntersectionObserver 기본값 — 등장 시점은 rootMargin 한 곳으로만 늦춘다(아래 15%) */
/* threshold 는 0 이다 — 뷰포트보다 큰 요소는 비율이 임계치에 영원히 못 닿아 등장 자체가 사라진다 */
export const IN_VIEW_DEFAULTS = {
  rootMargin: '0px 0px -15% 0px',
  threshold: 0,
  once: true,
} as const;

/** stagger 최대 단계 — 항목이 많아도 마지막 등장이 하염없이 밀리지 않게 자르는 지점 */
export const STAGGER_MAX_STEPS = 8;

/** CSS 에 넘길 stagger 단계 — 지연 "값"이 아니라 배수만 넘겨 duration 소유권을 CSS 에 남긴다 */
export const staggerIndex = (index: number): number => {
  return Math.min(index, STAGGER_MAX_STEPS);
};
