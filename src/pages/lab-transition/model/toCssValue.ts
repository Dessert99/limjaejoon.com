/** TransitionConfig → 실제 CSS transition 선언 문자열 변환 */
import {
  PROPERTY_OPTIONS,
  type Timing,
  type TransitionConfig,
} from './presets';

/** timing 상태 → CSS 값. 프리셋은 키워드, 커스텀은 cubic-bezier() 함수 표기 */
export function timingToCss(timing: Timing): string {
  if (timing.kind === 'preset') {
    return timing.name;
  }
  const [x1, y1, x2, y2] = timing.points;
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

/** config → "transform 600ms ease 0ms" — transition 축약형의 값 부분 */
export function toCssValue(config: TransitionConfig): string {
  // 데모 id가 아니라 실제 CSS 프로퍼티가 transition 대상 — translate-x·scale·rotate는 전부 transform
  const cssProperty = PROPERTY_OPTIONS.find((option) => {
    return option.id === config.property;
  })!.cssProperty;
  return `${cssProperty} ${config.durationMs}ms ${timingToCss(config.timing)} ${config.delayMs}ms`;
}
