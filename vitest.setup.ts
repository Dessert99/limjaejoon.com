import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/shared/api/mocks/server';

// MSW 목 서버: 테스트 전체에서 켜고, 핸들링 안 된 요청은 에러로 드러낸다.
beforeAll(() => {
  return server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  return server.resetHandlers();
});
afterAll(() => {
  return server.close();
});

// globals:false 라 RTL 자동 cleanup 이 안 걸린다 — 각 테스트 후 수동 언마운트.
afterEach(() => {
  cleanup();
});

// jsdom 에는 IntersectionObserver 가 없다 — 무동작 스텁으로 마운트만 통과시키고,
// 교차를 실제로 제어해야 하는 테스트는 vi.stubGlobal 로 각자 덮어쓴다.
class NoopIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: readonly number[] = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  NoopIntersectionObserver as unknown as typeof IntersectionObserver;

// jsdom 29 에는 dialog 의 showModal·close 가 없다 — open 속성만 토글하는 최소 폴리필로 대체한다.
// 포커스 가둠·Escape·backdrop 은 브라우저가 하는 일이라 흉내 내지 않는다. 그건 Storybook 에서 사람이 본다.
const dialogPrototype = globalThis.HTMLDialogElement?.prototype;

if (dialogPrototype && typeof dialogPrototype.showModal !== 'function') {
  const open = function open(this: HTMLDialogElement): void {
    this.setAttribute('open', '');
  };

  dialogPrototype.showModal = open;
  dialogPrototype.show = open;
  dialogPrototype.close = function close(this: HTMLDialogElement): void {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}
