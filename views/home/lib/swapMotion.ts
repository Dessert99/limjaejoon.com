
export const SWAP = { duration: 0.45, ease: 'power3.out' } as const;

export const PANEL = { duration: 0.7, ease: 'power4.inOut' } as const;

const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const swapDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0 : duration;
};
