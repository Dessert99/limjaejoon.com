import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from './presets';
import { useTransitionConfig } from './useTransitionConfig';

describe('useTransitionConfig', () => {
  it('기본값으로 시작한다', () => {
    const { result } = renderHook(() => useTransitionConfig());
    expect(result.current.config).toEqual(DEFAULT_CONFIG);
  });

  it('각 핸들러는 해당 필드만 바꾼다', () => {
    const { result } = renderHook(() => useTransitionConfig());

    act(() => result.current.setProperty('opacity'));
    act(() => result.current.setDurationMs(1000));
    act(() => result.current.setDelayMs(200));

    expect(result.current.config.property).toBe('opacity');
    expect(result.current.config.durationMs).toBe(1000);
    expect(result.current.config.delayMs).toBe(200);
    expect(result.current.config.timing).toEqual(DEFAULT_CONFIG.timing);
  });

  it('커스텀 좌표를 넣으면 timing이 custom으로 전환된다', () => {
    const { result } = renderHook(() => useTransitionConfig());

    act(() => result.current.setCustomPoints([0.1, 0.2, 0.3, 0.4]));
    expect(result.current.config.timing).toEqual({
      kind: 'custom',
      points: [0.1, 0.2, 0.3, 0.4],
    });

    act(() => result.current.selectPreset('linear'));
    expect(result.current.config.timing).toEqual({ kind: 'preset', name: 'linear' });
  });
});
