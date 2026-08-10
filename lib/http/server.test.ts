import { beforeEach, describe, expect, it, vi } from 'vitest';
import { serverFetchJson } from './server';

const get = vi.fn();

vi.mock('next/headers', () => {
  return {
    headers: vi.fn(async () => {
      return { get };
    }),
  };
});

describe('serverFetchJson', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('요청 헤더의 host/proto 로 상대 경로를 절대 URL 로 바꾼다', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ posts: [] }), {
        headers: { 'content-type': 'application/json' },
      })
    );
    get.mockImplementation((name: string) => {
      return (
        {
          'x-forwarded-host': 'example.test',
          'x-forwarded-proto': 'https',
        }[name] ?? null
      );
    });

    await serverFetchJson('/api/posts', { next: { tags: ['posts'] } }, fetcher);

    expect(fetcher).toHaveBeenCalledWith('https://example.test/api/posts', {
      next: { tags: ['posts'] },
    });
  });
});
