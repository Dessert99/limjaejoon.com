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
