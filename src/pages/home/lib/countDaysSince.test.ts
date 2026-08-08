/** countDaysSince 테스트 — 시작일을 1일째로 세는 경과일 계약을 검증한다 */
import { describe, expect, it } from 'vitest';
import { countDaysSince } from './countDaysSince';

describe('countDaysSince', () => {
  it('시작일 당일은 1일째다', () => {
    expect(countDaysSince('2025-03-01', new Date(2025, 2, 1, 9))).toBe(1);
  });

  it('하루 뒤는 2일째다', () => {
    expect(countDaysSince('2025-03-01', new Date(2025, 2, 2, 9))).toBe(2);
  });

  it('같은 날이면 시각이 달라도 같은 값이다', () => {
    // 시각이 섞이면 자정을 낀 새로고침마다 숫자가 1씩 흔들린다
    expect(countDaysSince('2025-03-01', new Date(2025, 2, 10, 0, 0))).toBe(
      countDaysSince('2025-03-01', new Date(2025, 2, 10, 23, 59))
    );
  });

  it('윤년 2월을 지나도 하루를 빠뜨리지 않는다', () => {
    expect(countDaysSince('2024-02-01', new Date(2024, 2, 1))).toBe(30);
  });

  it('해를 넘겨도 이어서 센다', () => {
    expect(countDaysSince('2025-03-01', new Date(2026, 7, 7))).toBe(525);
  });
});
