import { describe, expect, it, vi } from 'vitest';
import { fetchJson, HttpError } from './core';

describe('fetchJson', () => {
  it('성공 응답의 JSON 본문을 반환한다', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        headers: { 'content-type': 'application/json' },
      })
    );

    await expect(
      fetchJson<{ ok: boolean }>('/api/ping', {}, fetcher)
    ).resolves.toEqual({
      ok: true,
    });
    expect(fetcher).toHaveBeenCalledWith('/api/ping', {});
  });

  it('실패 응답이면 상태 코드와 JSON 본문을 가진 HttpError 를 던진다', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'missing' }), {
        status: 404,
        statusText: 'Not Found',
        headers: { 'content-type': 'application/json' },
      })
    );

    try {
      await fetchJson('/api/missing', {}, fetcher);
      throw new Error('Expected fetchJson to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect(error).toMatchObject({
        status: 404,
        statusText: 'Not Found',
        body: { message: 'missing' },
      });
    }
  });
});
