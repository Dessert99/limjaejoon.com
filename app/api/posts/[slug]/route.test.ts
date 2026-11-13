import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPostBySlug } from '@/domains/posts/api/posts';
import { createSupabaseStaticClient } from '@/lib/supabase/static';
import { GET } from './route';

vi.mock('@/lib/supabase/static', () => {
  return { createSupabaseStaticClient: vi.fn() };
});

vi.mock('@/domains/posts/api/posts', () => {
  return { getPostBySlug: vi.fn() };
});

describe('GET /api/posts/[slug]', () => {
  beforeEach(() => {
    vi.mocked(createSupabaseStaticClient).mockReset();
    vi.mocked(getPostBySlug).mockReset();
  });

  it('글이 없으면 404 JSON 을 반환한다', async () => {
    vi.mocked(createSupabaseStaticClient).mockReturnValue({} as never);
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
