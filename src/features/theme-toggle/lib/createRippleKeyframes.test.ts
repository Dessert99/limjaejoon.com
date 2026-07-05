/** createRippleKeyframes 테스트 — 보간 가능성·시작점 수렴·화면 덮임·일렁임 계약을 검증 */
import { describe, expect, it } from 'vitest';
import { createRippleKeyframes } from './createRippleKeyframes';

const ORIGIN = { x: 100, y: 50 };
const RADIUS = 800;

// polygon(...) 문자열에서 꼭짓점별 origin까지의 거리를 복원
const toDistances = (frame: string) => {
  const pairs = frame.replace(/^polygon\(|\)$/g, '').split(', ');
  return pairs.map((pair) => {
    const [x, y] = pair.split(' ').map(parseFloat);
    return Math.hypot(x - ORIGIN.x, y - ORIGIN.y);
  });
};

describe('createRippleKeyframes', () => {
  it('모든 키프레임은 같은 꼭짓점 수의 polygon이다 — 브라우저 보간의 전제', () => {
    const frames = createRippleKeyframes(ORIGIN, RADIUS);
    expect(frames.length).toBeGreaterThanOrEqual(2);
    const counts = frames.map((frame) => {
      return toDistances(frame).length;
    });
    expect(new Set(counts).size).toBe(1);
    expect(
      frames.every((frame) => {
        return frame.startsWith('polygon(');
      })
    ).toBe(true);
  });

  it('첫 키프레임은 origin의 점으로 수렴한다', () => {
    const [first] = createRippleKeyframes(ORIGIN, RADIUS);
    for (const distance of toDistances(first)) {
      expect(distance).toBeLessThan(1);
    }
  });

  it('마지막 키프레임은 요청 반지름 전체를 덮는다', () => {
    const frames = createRippleKeyframes(ORIGIN, RADIUS);
    for (const distance of toDistances(frames[frames.length - 1])) {
      expect(distance).toBeGreaterThanOrEqual(RADIUS);
    }
  });

  it('중간 키프레임의 가장자리는 일렁인다 — 꼭짓점 반지름이 균일하지 않다', () => {
    const frames = createRippleKeyframes(ORIGIN, RADIUS);
    const middle = toDistances(frames[Math.floor(frames.length / 2)]);
    const spread = Math.max(...middle) - Math.min(...middle);
    expect(spread).toBeGreaterThan(1);
  });
});
