import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateAdminPost } from '@/entities/post';
import { createSupabaseAdminClient, verifyAdminPostToken } from '@/shared/api';
import { readServerEnv } from '@/shared/config';
import { PATCH } from './route';

vi.mock('@/shared/config', () => {
  return { readServerEnv: vi.fn() };
});

vi.mock('@/shared/api', () => {
  return {
    createSupabaseAdminClient: vi.fn(),
    verifyAdminPostToken: vi.fn((received, expected) => {
      return received === expected;
    }),
  };
});

vi.mock('@/entities/post', () => {
  return { updateAdminPost: vi.fn() };
});

const input = {
  title: '수정 글',
  slug: 'updated-post',
  description: '수정 글 설명',
  category: 'frontend',
  series: null,
  tags: ['Next.js'],
  status: 'published' as const,
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 수정 글',
};

const post = {
  id: '1',
  ...input,
  created_at: '2026-07-09T00:00:00Z',
  updated_at: '2026-07-09T00:00:00Z',
};

describe('PATCH /api/admin/posts/[id]', () => {
  beforeEach(() => {
    vi.mocked(readServerEnv).mockReset();
    vi.mocked(createSupabaseAdminClient).mockReset();
    vi.mocked(verifyAdminPostToken).mockClear();
    vi.mocked(updateAdminPost).mockReset();
    vi.mocked(readServerEnv).mockReturnValue({
      supabaseUrl: 'https://remote.supabase.co',
      supabaseAnonKey: 'anon-key',
      supabaseServiceRoleKey: 'service-role-key',
      postImageBucket: 'post-images',
      adminPostToken: 'secret',
    });
  });

  it('admin token 이 없으면 401 을 반환하고 write 를 실행하지 않는다', async () => {
    const response = await PATCH(
      new Request('https://limjaejoon.com/api/admin/posts/1', {
        body: JSON.stringify(input),
        method: 'PATCH',
      }),
      { params: Promise.resolve({ id: '1' }) }
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
    expect(updateAdminPost).not.toHaveBeenCalled();
  });

  it('유효한 admin token 이면 글을 수정한다', async () => {
    const client = { id: 'admin-client' };
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    vi.mocked(updateAdminPost).mockResolvedValue(post);

    const response = await PATCH(
      new Request('https://limjaejoon.com/api/admin/posts/1', {
        body: JSON.stringify(input),
        headers: { 'x-admin-post-token': 'secret' },
        method: 'PATCH',
      }),
      { params: Promise.resolve({ id: '1' }) }
    );

    expect(updateAdminPost).toHaveBeenCalledWith(client, '1', input);
    await expect(response.json()).resolves.toEqual({ post });
    expect(response.status).toBe(200);
  });
});
