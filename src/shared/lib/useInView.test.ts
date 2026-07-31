/** useInView 테스트 — 상태 전이와 미지원 환경 폴백을 검증한다 */
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useInView } from './useInView';

type ObserverSpy = {
  callback: IntersectionObserverCallback;
  observed: Element[];
  unobserved: Element[];
  disconnected: boolean;
};

const spies: ObserverSpy[] = [];

/** 교차를 직접 밀어 넣을 수 있는 관찰자 — 마지막으로 만들어진 것에 스파이가 붙는다 */
const stubObserver = (): void => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      private readonly spy: ObserverSpy;

      constructor(callback: IntersectionObserverCallback) {
        this.spy = {
          callback,
          observed: [],
          unobserved: [],
          disconnected: false,
        };
        spies.push(this.spy);
      }

      observe(target: Element): void {
        this.spy.observed.push(target);
      }

      unobserve(target: Element): void {
        this.spy.unobserved.push(target);
      }

      disconnect(): void {
        this.spy.disconnected = true;
      }
    }
  );
};

/** 관찰자 콜백을 사람 대신 호출한다 — jsdom 은 실제 교차를 만들지 못한다 */
const intersect = (
  spy: ObserverSpy,
  isIntersecting: boolean,
  intersectionRatio = isIntersecting ? 1 : 0
): void => {
  act(() => {
    spy.callback(
      [
        {
          isIntersecting,
          intersectionRatio,
          target: spy.observed[0],
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    );
  });
};

/** 훅과 관찰 대상 엘리먼트를 묶어 마운트한다 */
const mount = (options?: Parameters<typeof useInView>[0]) => {
  const element = document.createElement('div');
  const rendered = renderHook(() => {
    const [ref, state] = useInView<HTMLDivElement>(options);
    // renderHook 은 DOM 을 만들지 않는다 — ref 에 엘리먼트를 직접 물려 관찰이 시작되게 한다
    ref.current = element;
    return state;
  });

  return { ...rendered, element, spy: spies[spies.length - 1] };
};

afterEach(() => {
  spies.length = 0;
  vi.unstubAllGlobals();
});

describe('useInView', () => {
  it('마운트하면 대상을 관찰하되 아직 은닉하지 않는다', () => {
    stubObserver();

    const { result, element, spy } = mount();

    expect(result.current).toBe('idle');
    expect(spy.observed).toEqual([element]);
  });

  it('관찰자가 화면 밖이라고 알리면 은닉 상태로 들어간다', () => {
    stubObserver();

    const { result, spy } = mount();
    intersect(spy, false);

    expect(result.current).toBe('out');
  });

  it('마운트 시점에 이미 보이면 은닉을 거치지 않고 곧장 in 이 된다', () => {
    stubObserver();

    const { result, spy } = mount();
    intersect(spy, true);

    expect(result.current).toBe('in');
  });

  it('threshold 에 못 미치게 걸쳐 있으면 아직 등장시키지 않는다', () => {
    // 최초 보고는 threshold 와 무관하게 온다 — isIntersecting 만 믿으면 1% 만 걸쳐도 등장이 끝나버린다
    stubObserver();

    const { result, spy } = mount({ threshold: 0.5 });
    intersect(spy, true, 0.1);

    expect(result.current).toBe('out');
  });

  it('once 면 한 번 등장한 뒤 관찰을 끊는다', () => {
    stubObserver();

    const { element, spy } = mount({ once: true });
    intersect(spy, true);

    expect(spy.unobserved).toEqual([element]);
  });

  it('once 가 아니면 벗어날 때 out 으로 돌아간다', () => {
    stubObserver();

    const { result, spy } = mount({ once: false });
    intersect(spy, true);
    intersect(spy, false);

    expect(result.current).toBe('out');
  });

  it('언마운트하면 관찰을 정리한다', () => {
    stubObserver();

    const { unmount, spy } = mount();
    unmount();

    expect(spy.disconnected).toBe(true);
  });

  it('enabled 가 false 면 관찰을 시작하지 않는다', () => {
    // 로드 시점 등장처럼 뷰포트와 무관한 트리거를 쓸 때 관찰자를 헛돌리지 않는다
    stubObserver();

    const { result, spy } = mount({ enabled: false });

    expect(result.current).toBe('idle');
    expect(spy).toBeUndefined();
  });

  it('IntersectionObserver 가 없으면 은닉하지 않고 idle 에 머문다', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    const element = document.createElement('div');
    const { result } = renderHook(() => {
      const [ref, state] = useInView<HTMLDivElement>();
      ref.current = element;
      return state;
    });

    expect(result.current).toBe('idle');
  });
});
