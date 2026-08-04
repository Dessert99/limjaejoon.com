/** 모션 프리셋 테스트 — 컴포넌트 사이 시차가 무한정 밀리지 않는다는 계약을 검증한다 */
import { describe, expect, it } from 'vitest';
import { STAGGER_MAX_STEPS, staggerIndex } from './motionPreset';

describe('staggerIndex', () => {
  it('상한 아래에서는 인덱스를 그대로 돌려준다', () => {
    expect(staggerIndex(3)).toBe(3);
  });

  it('상한을 넘으면 상한에서 멈춘다', () => {
    expect(staggerIndex(STAGGER_MAX_STEPS + 5)).toBe(STAGGER_MAX_STEPS);
  });
});
