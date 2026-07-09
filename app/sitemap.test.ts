import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPublishedPostNavigationData } from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';
import sitemap from './sitemap';

vi.mock('@/shared/api', () => {
  return { createSupabaseStaticClient: vi.fn() };
});

vi.mock('@/entities/post', () => {
  return { getPublishedPostNavigationData: vi.fn() };
});

describe('sitemap', () => {
  beforeEach(() => {
    vi.mocked(createSupabaseStaticClient).mockReset();
    vi.mocked(getPublishedPostNavigationData).mockReset();
  });

  it('blog route 와 published post route 를 포함한다', async () => {
    const client = { id: 'static-client' };
    vi.mocked(createSupabaseStaticClient).mockReturnValue(client as never);
    vi.mocked(getPublishedPostNavigationData).mockResolvedValue([
      {
        id: '1',
        slug: '2026-04-06-next-fetch',
        title: 'Next fetch',
        description: 'Next fetch cache',
        tags: ['Next.js'],
        category: 'frontend',
        series: 'Next.js App Router',
        published_at: '2026-04-06T00:00:00Z',
      },
    ]);

    await expect(await sitemap()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: 'https://limjaejoon.com/blog' }),
        expect.objectContaining({
          url: 'https://limjaejoon.com/blog/2026-04-06-next-fetch',
        }),
      ])
    );
    expect(getPublishedPostNavigationData).toHaveBeenCalledWith(client);
  });
});
