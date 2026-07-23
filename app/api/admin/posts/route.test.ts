import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminPost } from '@/entities/post';
import { createSupabaseAdminClient, verifyAdminPostToken } from '@/shared/api';
import { readServerEnv } from '@/shared/config';
import { POST } from './route';

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
  return { createAdminPost: vi.fn() };
});

const input = {
  title: '새 글',
  slug: 'new-post',
  description: '새 글 설명',
  series: null,
  tags: ['Next.js'],
  status: 'draft' as const,
  published_at: null,
  content_markdown: '# 새 글',
};

const post = {
  id: '1',
  ...input,
  created_at: '2026-07-09T00:00:00Z',
  updated_at: '2026-07-09T00:00:00Z',
};

describe('POST /api/admin/posts', () => {
  beforeEach(() => {
    vi.mocked(readServerEnv).mockReset();
    vi.mocked(createSupabaseAdminClient).mockReset();
    vi.mocked(verifyAdminPostToken).mockClear();
    vi.mocked(createAdminPost).mockReset();
    vi.mocked(readServerEnv).mockReturnValue({
      supabaseUrl: 'https://remote.supabase.co',
      supabaseAnonKey: 'anon-key',
      supabaseServiceRoleKey: 'service-role-key',
      postImageBucket: 'post-images',
      adminPostToken: 'secret',
      adminEmail: 'admin@example.com',
    });
  });

  it('admin token 이 없으면 401 을 반환하고 write 를 실행하지 않는다', async () => {
    const response = await POST(
      new Request('https://limjaejoon.com/api/admin/posts', {
        body: JSON.stringify(input),
        method: 'POST',
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
    expect(createAdminPost).not.toHaveBeenCalled();
  });

  it('유효한 admin token 이면 글을 생성한다', async () => {
    const client = { id: 'admin-client' };
    vi.mocked(createSupabaseAdminClient).mockReturnValue(client as never);
    vi.mocked(createAdminPost).mockResolvedValue(post);

    const response = await POST(
      new Request('https://limjaejoon.com/api/admin/posts', {
        body: JSON.stringify(input),
        headers: { 'x-admin-post-token': 'secret' },
        method: 'POST',
      })
    );

    expect(createAdminPost).toHaveBeenCalledWith(client, input);
    await expect(response.json()).resolves.toEqual({ post });
    expect(response.status).toBe(201);
  });
});
