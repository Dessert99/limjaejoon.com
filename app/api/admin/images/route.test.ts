import { beforeEach, describe, expect, it, vi } from 'vitest';
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

const makeRequest = (token?: string) => {
  const formData = new FormData();
  formData.set('file', new File(['image'], 'image.png', { type: 'image/png' }));

  return new Request('https://limjaejoon.com/api/admin/images', {
    body: formData,
    headers: token ? { 'x-admin-post-token': token } : undefined,
    method: 'POST',
  });
};

describe('POST /api/admin/images', () => {
  beforeEach(() => {
    vi.mocked(readServerEnv).mockReset();
    vi.mocked(createSupabaseAdminClient).mockReset();
    vi.mocked(verifyAdminPostToken).mockClear();
    vi.mocked(readServerEnv).mockReturnValue({
      supabaseUrl: 'https://remote.supabase.co',
      supabaseAnonKey: 'anon-key',
      supabaseServiceRoleKey: 'service-role-key',
      postImageBucket: 'post-images',
      adminPostToken: 'secret',
    });
  });

  it('admin token 이 없으면 401 을 반환하고 storage upload 를 실행하지 않는다', async () => {
    const response = await POST(makeRequest());

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it('유효한 admin token 이면 이미지를 업로드하고 public URL 을 반환한다', async () => {
    const upload = vi.fn().mockResolvedValue({ error: null });
    const getPublicUrl = vi.fn(() => {
      return { data: { publicUrl: 'https://cdn.example.com/image.png' } };
    });
    const from = vi.fn(() => {
      return { getPublicUrl, upload };
    });
    vi.mocked(createSupabaseAdminClient).mockReturnValue({
      storage: { from },
    } as never);

    const response = await POST(makeRequest('secret'));
    const body = await response.json();

    expect(from).toHaveBeenCalledWith('post-images');
    expect(upload).toHaveBeenCalledWith(
      expect.stringMatching(/^posts\//),
      expect.any(Object)
    );
    expect(body).toEqual({
      path: expect.stringMatching(/^posts\//),
      url: 'https://cdn.example.com/image.png',
    });
    expect(response.status).toBe(201);
  });
});
