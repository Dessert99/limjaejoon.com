/** 상단 나열과 햄버거가 자리를 바꾸는 동작 값 — 두 컴포넌트가 같은 박자로 교차해야 한 번의 교대로 읽힌다 */

/** 교대 한 번 — 값은 GSAP 이 소유한다(CSS 토큰을 읽어 오지 않는다) */
export const SWAP = { duration: 0.45, ease: 'power3.out' } as const;

/** 사이드바가 들어오고 나가는 시간 — 교대보다 길게 잡아 패널이 더 무겁게 읽힌다 */
export const PANEL = { duration: 0.7, ease: 'power4.inOut' } as const;

/** 감쇠 여부 — 렌더가 아니라 트윈을 만드는 순간에 묻는다 */
const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/** 감쇠에서는 트윈을 없애는 대신 길이를 0 으로 만든다 — nav 가 영영 안 숨는 것보다 즉시 교대가 낫다(gsap.md 6절) */
export const swapDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0 : duration;
};
