
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
    total: 0.8,
  },
} as const;

export const STAGGER_MAX_STEPS = 8;

export const staggerIndex = (index: number): number => {
  return Math.min(index, STAGGER_MAX_STEPS);
};
