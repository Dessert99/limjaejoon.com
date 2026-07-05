/** withCircularReveal 테스트 — 어떤 환경에서든 테마 변경 자체는 반드시 실행되는 계약을 검증 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { withCircularReveal } from './withCircularReveal';

// lib.dom엔 필수 프로퍼티라 부분 목 주입·삭제가 막힌다 — 옵셔널로 좁힌 뷰로 캐스팅
const doc = document as unknown as {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

describe('withCircularReveal', () => {
  afterEach(() => {
    delete doc.startViewTransition;
    // @ts-expect-error jsdom에 원래 없는 API라 주입분을 원상복구
    delete document.documentElement.animate;
    vi.unstubAllGlobals();
  });

  it('뷰 트랜지션 미지원 환경이면 즉시 apply를 실행한다', () => {
    const apply = vi.fn();
    withCircularReveal(apply, { x: 0, y: 0 });
    expect(apply).toHaveBeenCalledOnce();
  });

  it('모션 축소 선호 환경이면 뷰 트랜지션 없이 즉시 apply를 실행한다', () => {
    const startViewTransition = vi.fn();
    doc.startViewTransition = startViewTransition;
    vi.stubGlobal('matchMedia', (query: string) => {
      return { matches: query.includes('reduce'), media: query };
    });

    const apply = vi.fn();
    withCircularReveal(apply, { x: 0, y: 0 });
    expect(apply).toHaveBeenCalledOnce();
    expect(startViewTransition).not.toHaveBeenCalled();
  });

  it('지원 환경이면 뷰 트랜지션 안에서 apply를 실행하고 새 스냅샷에 원형 clip-path를 건다', async () => {
    const ready = Promise.resolve();
    const apply = vi.fn();
    doc.startViewTransition = vi.fn((callback: () => void) => {
      callback();
      return { ready };
    });
    vi.stubGlobal('matchMedia', (query: string) => {
      return { matches: false, media: query };
    });
    // jsdom엔 WAAPI(Element.animate)가 없다 — 스파이 불가라 직접 주입
    const animate = vi.fn();
    document.documentElement.animate = animate;

    withCircularReveal(apply, { x: 10, y: 20 });
    expect(apply).toHaveBeenCalledOnce();

    // ready 이후에 애니메이션이 걸린다 — 마이크로태스크 플러시
    await ready;
    expect(animate).toHaveBeenCalledOnce();
    const [keyframes, options] = animate.mock.calls[0];
    expect(JSON.stringify(keyframes)).toContain('circle(0px at 10px 20px)');
    expect(options).toMatchObject({
      pseudoElement: '::view-transition-new(root)',
    });
  });
});
