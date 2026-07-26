/** 파랄랙스 계산 테스트 — GSAP 없이 검증 가능한 순수 로직만 다룬다 */
import { describe, expect, it } from 'vitest';
import { layerShift, resolveParallaxConfig } from './parallax';

describe('resolveParallaxConfig', () => {
  it('reduced-motion 이면 null 을 돌려 핀과 이동을 모두 끈다', () => {
    expect(
      resolveParallaxConfig({ isDesktop: true, reduceMotion: true })
    ).toBeNull();
    expect(
      resolveParallaxConfig({ isDesktop: false, reduceMotion: true })
    ).toBeNull();
  });

  it('모바일에서도 핀을 유지하되 이동 거리는 데스크톱보다 짧다', () => {
    const desktop = resolveParallaxConfig({
      isDesktop: true,
      reduceMotion: false,
    });
    const mobile = resolveParallaxConfig({
      isDesktop: false,
      reduceMotion: false,
    });

    expect(desktop?.pin).toBe(true);
    expect(mobile?.pin).toBe(true);
    expect(mobile!.travelRatio).toBeLessThan(desktop!.travelRatio);
  });
});

describe('layerShift', () => {
  it('진행도 0 에서는 움직이지 않는다', () => {
    expect(layerShift(0.5, 0, 800)).toBe(0);
  });

  it('depth 가 클수록 같은 진행도에서 더 많이 움직인다', () => {
    expect(layerShift(0.6, 1, 800)).toBeGreaterThan(layerShift(0.2, 1, 800));
  });

  it('depth 0 인 겹은 진행도와 무관하게 고정된다', () => {
    expect(layerShift(0, 1, 800)).toBe(0);
  });
});
