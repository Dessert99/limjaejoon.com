import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './server';

// 하네스 스모크: MSW 가 node 환경에서 fetch 요청을 실제로 가로채는지 확인한다.
describe('MSW 서버', () => {
  it('등록한 핸들러로 fetch 응답을 가로챈다', async () => {
    server.use(
      http.get('https://example.test/ping', () => {
        return HttpResponse.json({ ok: true });
      })
    );

    const res = await fetch('https://example.test/ping');
    await expect(res.json()).resolves.toEqual({ ok: true });
  });
});
