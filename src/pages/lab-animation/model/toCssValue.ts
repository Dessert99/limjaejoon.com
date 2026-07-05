/** AnimationConfig → 실제 CSS animation 축약형 값 변환 */
import type { AnimationConfig } from './presets';

/** config → "slide 1200ms ease 0ms infinite alternate none running" — animation 축약형의 값 부분 */
export function toCssValue(config: AnimationConfig): string {
  // 시간값 두 개는 앞이 duration, 뒤가 delay로 해석된다 — 순서가 곧 의미
  return `${config.preset} ${config.durationMs}ms ${config.timing} ${config.delayMs}ms ${config.iterationCount} ${config.direction} ${config.fillMode} ${config.playState}`;
}
