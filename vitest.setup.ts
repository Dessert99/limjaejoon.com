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

// jsdom 에는 matchMedia 가 없다 — gsap.matchMedia() 가 마운트 단계에서 터진다.
// 전부 false 로 답해 (prefers-reduced-motion: no-preference) 가 안 걸리게 한다
// — 테스트는 마크업 계약만 보고 애니메이션 생성은 브라우저 몫으로 남긴다.
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
