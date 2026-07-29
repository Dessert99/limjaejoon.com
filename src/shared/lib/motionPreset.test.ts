/** motionPreset 테스트 — 긴 목록에서 등장이 하염없이 밀리지 않게 자르는 규칙만 검증한다 */
import { describe, expect, it } from 'vitest';
import { STAGGER_MAX_STEPS, staggerIndex } from './motionPreset';

describe('staggerIndex', () => {
  it('상한 이하 인덱스는 그대로 통과시킨다', () => {
    expect(staggerIndex(0)).toBe(0);
    expect(staggerIndex(3)).toBe(3);
  });

  it('상한을 넘는 인덱스는 상한으로 자른다', () => {
    expect(staggerIndex(STAGGER_MAX_STEPS + 5)).toBe(STAGGER_MAX_STEPS);
  });
});
