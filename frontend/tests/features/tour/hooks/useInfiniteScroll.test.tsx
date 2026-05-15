// useInfiniteScroll hook 단위 테스트 — IntersectionObserver를 vi.stubGlobal로 mock (jsdom 미지원)
// callback ref 패턴이므로 sentinelRef(el)를 직접 호출해 DOM attach를 시뮬레이션
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useInfiniteScroll } from '@/features/tour/hooks/useInfiniteScroll';

// IntersectionObserver 콜백을 외부에서 수동 실행할 수 있도록 저장
let capturedCallback: IntersectionObserverCallback | null = null;
let disconnectMock: ReturnType<typeof vi.fn>;
let observeMock: ReturnType<typeof vi.fn>;

// jsdom은 IntersectionObserver를 제공하지 않으므로 전역에 mock 클래스를 주입
function buildMockObserverClass() {
  disconnectMock = vi.fn();
  observeMock = vi.fn();

  return class MockIntersectionObserver {
    constructor(cb: IntersectionObserverCallback) {
      // 생성 시 콜백을 캡처해 두고 테스트에서 수동 발화
      capturedCallback = cb;
    }
    observe = observeMock;
    disconnect = disconnectMock;
    unobserve = vi.fn();
    takeRecords = vi.fn(() => {
return []
});
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];
  };
}

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    capturedCallback = null;
    vi.stubGlobal('IntersectionObserver', buildMockObserverClass());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sentinel이 viewport에 진입하고 hasMore=true, isLoading=false이면 onLoadMore를 호출한다', () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() => {
return useInfiniteScroll({ hasMore: true, isLoading: false, onLoadMore })
}
    );

    // callback ref에 가짜 DOM 요소를 직접 전달 — DOM attach를 시뮬레이션
    const fakeEl = document.createElement('div');
    result.current(fakeEl);

    // IntersectionObserver 콜백 수동 발화 — isIntersecting: true
    capturedCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('hasMore=false이면 viewport에 진입해도 onLoadMore를 호출하지 않는다', () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() => {
return useInfiniteScroll({ hasMore: false, isLoading: false, onLoadMore })
}
    );

    const fakeEl = document.createElement('div');
    result.current(fakeEl);

    capturedCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('isLoading=true이면 viewport에 진입해도 onLoadMore를 호출하지 않는다', () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() => {
return useInfiniteScroll({ hasMore: true, isLoading: true, onLoadMore })
}
    );

    const fakeEl = document.createElement('div');
    result.current(fakeEl);

    capturedCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('null이 전달되면 observer.disconnect가 호출된다 (unmount/cleanup)', () => {
    const { result } = renderHook(() => {
return useInfiniteScroll({
        hasMore: true,
        isLoading: false,
        onLoadMore: vi.fn(),
      })
}
    );

    // 먼저 요소를 attach해 observer를 생성
    const fakeEl = document.createElement('div');
    result.current(fakeEl);

    // null 전달로 detach 시뮬레이션 — cleanup 경로
    result.current(null);

    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
