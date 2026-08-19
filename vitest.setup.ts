import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/lib/mocks/server';

beforeAll(() => {
  return server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
  return server.resetHandlers();
});
afterAll(() => {
  return server.close();
});

afterEach(() => {
  cleanup();
});

globalThis.matchMedia = ((query: string) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {
      return false;
    },
  };
}) as unknown as typeof matchMedia;

globalThis.IntersectionObserver = class {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: readonly number[] = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
} as unknown as typeof IntersectionObserver;

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
