import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from './presets';
import { useAnimationConfig } from './useAnimationConfig';

describe('useAnimationConfig', () => {
  it('초기 상태는 DEFAULT_CONFIG다', () => {
    const { result } = renderHook(() => {
      return useAnimationConfig();
    });
    expect(result.current.config).toEqual(DEFAULT_CONFIG);
  });

  it('update는 전달한 필드만 바꾸고 나머지는 유지한다', () => {
    const { result } = renderHook(() => {
      return useAnimationConfig();
    });

    act(() => {
      result.current.update({ direction: 'reverse', durationMs: 800 });
    });
    expect(result.current.config.direction).toBe('reverse');
    expect(result.current.config.durationMs).toBe(800);
    expect(result.current.config.preset).toBe(DEFAULT_CONFIG.preset);
  });
});
