import { setupServer } from 'msw/node';

// 기본(전역) 핸들러는 두지 않는다 — 각 테스트가 server.use(...) 로 자기 요청만 등록한다.
// onUnhandledRequest:'error'(setup.ts) 와 합쳐 모킹 안 된 요청을 큰 소리로 실패시킨다.
export const server = setupServer();
