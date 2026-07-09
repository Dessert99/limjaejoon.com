import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSupabaseServerClient } from '@/shared/api';
import { getPublishedPosts } from '@/entities/post';
import { GET } from './route';

vi.mock('@/shared/api', () => {
  return { createSupabaseServerClient: vi.fn() };
});

vi.mock('@/entities/post', () => {
  return { getPublishedPosts: vi.fn() };
});

const posts = [
  {
    id: '1',
    slug: '2026-04-02-zshrc',
    title: 'zshrc 는 무엇인가?',
    description: 'zsh 설정 파일 설명',
    tags: ['zshrc'],
    series: null,
    published_at: '2026-04-02T00:00:00Z',
  },
];

describe('GET /api/posts', () => {
  beforeEach(() => {
    vi.mocked(createSupabaseServerClient).mockReset();
    vi.mocked(getPublishedPosts).mockReset();
  });

  it('published 글 목록을 JSON 으로 반환한다', async () => {
    const client = { id: 'client' };
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);
    vi.mocked(getPublishedPosts).mockResolvedValue(posts);

    const response = await GET();

    expect(getPublishedPosts).toHaveBeenCalledWith(client);
    await expect(response.json()).resolves.toEqual({ posts });
    expect(response.status).toBe(200);
  });
});
