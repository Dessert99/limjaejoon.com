/** easing tokens — CSS transition/animation timing-function 재료 */
export const easing = {
  linear: 'cubic-bezier(0, 0, 1, 1)',
  standard: 'cubic-bezier(0.35, 0, 0.35, 1)',
  enter: 'cubic-bezier(0, 0, 0.15, 1)',
  exit: 'cubic-bezier(0.35, 0, 1, 1)',
  expressive: 'cubic-bezier(0.03, 0.4, 0.1, 1)',
} as const;
