// useDebouncedValue hook 단위 테스트 — vitest fake timers로 비동기 없이 시간 제어
import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedValue } from '@/features/tour/hooks/useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    // setTimeout/clearTimeout을 가짜 구현으로 교체해 시간을 수동으로 제어
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('초기 렌더에서 즉시 value를 반환한다', () => {
    const { result } = renderHook(() => {
return useDebouncedValue('hello', 300)
});
    expect(result.current).toBe('hello');
  });

  it('value 변경 후 delay 경과 전엔 이전 값을 유지한다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => {
return useDebouncedValue(value, delay)
},
      { initialProps: { value: 'hello', delay: 300 } }
    );

    // value 변경
    rerender({ value: 'world', delay: 300 });

    // 299ms 경과 — 아직 debounce 미완료
    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('hello');
  });

  it('delay 경과 후엔 새 값으로 갱신된다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => {
return useDebouncedValue(value, delay)
},
      { initialProps: { value: 'hello', delay: 300 } }
    );

    rerender({ value: 'world', delay: 300 });

    // 300ms 경과 — debounce 완료
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('world');
  });

  it('연속 변경 시 마지막 값만 반영된다', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => {
return useDebouncedValue(value, delay)
},
      { initialProps: { value: 'a', delay: 300 } }
    );

    // 100ms 간격으로 3번 빠르게 변경
    rerender({ value: 'ab', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'abc', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'abcd', delay: 300 });
    // 마지막 변경 후 300ms 경과
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 중간 값들은 무시되고 마지막 값만 반영
    expect(result.current).toBe('abcd');
  });
});
