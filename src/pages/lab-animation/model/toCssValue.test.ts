import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from './presets';
import { toCssValue } from './toCssValue';

describe('toCssValue', () => {
  it('config를 animation 축약형 값 순서대로 직렬화한다', () => {
    expect(toCssValue(DEFAULT_CONFIG)).toBe(
      'slide 1200ms ease 0ms infinite alternate none running'
    );
  });

  it('숫자 iteration-count도 그대로 직렬화한다', () => {
    expect(
      toCssValue({ ...DEFAULT_CONFIG, iterationCount: 2, playState: 'paused' })
    ).toBe('slide 1200ms ease 0ms 2 alternate none paused');
  });
});
