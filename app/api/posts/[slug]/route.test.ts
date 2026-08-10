import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPostBySlug } from '@/views/blog/server/posts';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { GET } from './route';

vi.mock('@/lib/supabase/server', () => {
  return { createSupabaseServerClient: vi.fn() };
});

vi.mock('@/views/blog/server/posts', () => {
  return { getPostBySlug: vi.fn() };
});

describe('GET /api/posts/[slug]', () => {
  beforeEach(() => {
    vi.mocked(createSupabaseServerClient).mockReset();
    vi.mocked(getPostBySlug).mockReset();
  });

  it('글이 없으면 404 JSON 을 반환한다', async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue({} as never);
    vi.mocked(getPostBySlug).mockResolvedValue(null);

    const response = await GET(new Request('https://limjaejoon.com'), {
      params: Promise.resolve({ slug: 'missing' }),
    });

    await expect(response.json()).resolves.toEqual({
      message: 'Post not found',
    });
    expect(response.status).toBe(404);
  });
});
