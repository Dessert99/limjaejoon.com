import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, PROPERTY_OPTIONS, TIMING_PRESETS } from './presets';

describe('TIMING_PRESETS', () => {
  it('CSS 스펙이 정의한 키워드 좌표를 그대로 갖는다', () => {
    expect(TIMING_PRESETS.linear).toEqual([0, 0, 1, 1]);
    expect(TIMING_PRESETS.ease).toEqual([0.25, 0.1, 0.25, 1]);
    expect(TIMING_PRESETS['ease-in-out']).toEqual([0.42, 0, 0.58, 1]);
  });
});

describe('PROPERTY_OPTIONS', () => {
  it('transform 계열 데모는 전부 cssProperty transform으로 합쳐진다', () => {
    const transforms = PROPERTY_OPTIONS.filter((o) => {
      return ['translate-x', 'scale', 'rotate'].includes(o.id);
    });
    expect(transforms).toHaveLength(3);
    for (const option of transforms) {
      expect(option.cssProperty).toBe('transform');
    }
  });
});

describe('DEFAULT_CONFIG', () => {
  it('이동 데모와 ease 프리셋으로 시작한다', () => {
    expect(DEFAULT_CONFIG.property).toBe('translate-x');
    expect(DEFAULT_CONFIG.timing).toEqual({ kind: 'preset', name: 'ease' });
  });
});
