/** typography scale tokens — text semantic 의 재료 */
export const fontFamily = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
} as const;

/** font size scale tokens — rem 기준 텍스트 크기 */
export const fontSize = {
  12: '0.75rem',
  14: '0.875rem',
  16: '1rem',
  20: '1.25rem',
  24: '1.5rem',
  32: '2rem',
} as const;

/** line-height scale tokens — UI 텍스트 리듬 */
export const lineHeight = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.7',
} as const;

/** font weight scale tokens — semantic text 조합의 굵기 재료 */
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
