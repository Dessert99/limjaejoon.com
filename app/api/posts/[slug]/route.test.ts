import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPublishedPostBySlug } from '@/entities/post';
import { createSupabaseServerClient } from '@/shared/api';
import { GET } from './route';

vi.mock('@/shared/api', () => {
  return { createSupabaseServerClient: vi.fn() };
});

vi.mock('@/entities/post', () => {
  return { getPublishedPostBySlug: vi.fn() };
});

const post = {
  id: '1',
  slug: '2026-04-02-zshrc',
  title: 'zshrc 는 무엇인가?',
  description: 'zsh 설정 파일 설명',
  content_markdown: '# zshrc\n\n본문입니다.',
  tags: ['zshrc'],
  status: 'published' as const,
  published_at: '2026-04-02T00:00:00Z',
  created_at: '2026-04-02T00:00:00Z',
  updated_at: '2026-04-02T00:00:00Z',
};

describe('GET /api/posts/[slug]', () => {
  beforeEach(() => {
    vi.mocked(createSupabaseServerClient).mockReset();
    vi.mocked(getPublishedPostBySlug).mockReset();
  });

  it('slug 에 해당하는 published 글을 JSON 으로 반환한다', async () => {
    const client = { id: 'client' };
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);
    vi.mocked(getPublishedPostBySlug).mockResolvedValue(post);

    const response = await GET(new Request('https://limjaejoon.com'), {
      params: Promise.resolve({ slug: '2026-04-02-zshrc' }),
    });

    expect(getPublishedPostBySlug).toHaveBeenCalledWith(
      client,
      '2026-04-02-zshrc'
    );
    await expect(response.json()).resolves.toEqual({ post });
    expect(response.status).toBe(200);
  });

  it('글이 없으면 404 JSON 을 반환한다', async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue({} as never);
    vi.mocked(getPublishedPostBySlug).mockResolvedValue(null);

    const response = await GET(new Request('https://limjaejoon.com'), {
      params: Promise.resolve({ slug: 'missing' }),
    });

    await expect(response.json()).resolves.toEqual({
      message: 'Post not found',
    });
    expect(response.status).toBe(404);
  });
});
