import { describe, expect, it, vi } from 'vitest';
import { clientFetchJson } from './client';

describe('clientFetchJson', () => {
  it('브라우저 same-origin 쿠키 전달을 기본값으로 둔다', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        headers: { 'content-type': 'application/json' },
      })
    );

    await clientFetchJson('/api/posts', undefined, fetcher);

    expect(fetcher).toHaveBeenCalledWith('/api/posts', {
      credentials: 'same-origin',
    });
  });
});
