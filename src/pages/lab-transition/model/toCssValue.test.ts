import { describe, expect, it } from 'vitest';
import { timingToCss, toCssValue } from './toCssValue';

describe('timingToCss', () => {
  it('프리셋은 키워드 그대로 반환한다', () => {
    expect(timingToCss({ kind: 'preset', name: 'ease-in-out' })).toBe('ease-in-out');
  });

  it('커스텀 좌표는 cubic-bezier() 표기로 만든다', () => {
    expect(timingToCss({ kind: 'custom', points: [0.17, 0.67, 0.83, 0.67] })).toBe(
      'cubic-bezier(0.17, 0.67, 0.83, 0.67)'
    );
  });
});

describe('toCssValue', () => {
  it('property duration timing delay 순서의 축약값을 만든다', () => {
    expect(
      toCssValue({
        property: 'translate-x',
        durationMs: 600,
        delayMs: 100,
        timing: { kind: 'preset', name: 'ease' },
      })
    ).toBe('transform 600ms ease 100ms');
  });

  it('opacity 데모는 cssProperty opacity를 쓴다', () => {
    expect(
      toCssValue({
        property: 'opacity',
        durationMs: 300,
        delayMs: 0,
        timing: { kind: 'preset', name: 'linear' },
      })
    ).toBe('opacity 300ms linear 0ms');
  });
});
