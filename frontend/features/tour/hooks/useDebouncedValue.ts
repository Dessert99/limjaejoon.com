// 입력값을 지정된 delay만큼 지연시켜 반환 — 검색 입력 debounce에 사용
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후 값 갱신, cleanup에서 clearTimeout으로 이전 타이머 취소 (연속 입력 시 마지막만 반영)
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
