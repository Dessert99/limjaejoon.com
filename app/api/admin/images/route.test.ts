import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readPostImageBucket } from '@/config/env';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/adminGuard';
import { POST } from './route';

vi.mock('@/config/env', () => {
  return { readPostImageBucket: vi.fn() };
});

vi.mock('@/lib/auth/adminGuard', () => {
  return { requireAdmin: vi.fn(), mapWriteError: vi.fn() };
});

const makeRequest = (file: File) => {
  const formData = new FormData();
  formData.set('file', file);

  return new Request('https://limjaejoon.com/api/admin/images', {
    body: formData,
    method: 'POST',
  });
};

describe('POST /api/admin/images', () => {
  beforeEach(() => {
    vi.mocked(readPostImageBucket).mockReset();
    vi.mocked(requireAdmin).mockReset();
    vi.mocked(readPostImageBucket).mockReturnValue('post-images');
  });

  it('가드가 막으면 그 응답을 그대로 내고 storage upload 를 실행하지 않는다', async () => {
    const upload = vi.fn();
    const unauthorized = NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
    vi.mocked(requireAdmin).mockResolvedValue({
      client: {
        storage: {
          from: vi.fn(() => {
            return { upload };
          }),
        },
      } as never,
      error: unauthorized,
    });

    const response = await POST(
      makeRequest(new File(['image'], 'image.png', { type: 'image/png' }))
    );

    expect(response.status).toBe(401);
    expect(upload).not.toHaveBeenCalled();
  });

  it('허용되지 않은 MIME 타입이면 422 를 반환한다', async () => {
    const upload = vi.fn();
    vi.mocked(requireAdmin).mockResolvedValue({
      client: {
        storage: {
          from: vi.fn(() => {
            return { upload };
          }),
        },
      } as never,
      error: null,
    });

    const response = await POST(
      makeRequest(
        new File(['exe'], 'virus.exe', { type: 'application/x-msdownload' })
      )
    );

    expect(response.status).toBe(422);
    expect(upload).not.toHaveBeenCalled();
  });

  it('5MiB 를 초과하면 422 를 반환한다', async () => {
    const upload = vi.fn();
    vi.mocked(requireAdmin).mockResolvedValue({
      client: {
        storage: {
          from: vi.fn(() => {
            return { upload };
          }),
        },
      } as never,
      error: null,
    });
    const oversized = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      'big.png',
      {
        type: 'image/png',
      }
    );
    // jsdom 의 Request→FormData 왕복 직렬화가 대용량 바이너리를 깨뜨려 formData 를 직접 stub 한다
    const formData = new FormData();
    formData.set('file', oversized);
    const request = {
      formData: async () => {
        return formData;
      },
    } as unknown as Request;

    const response = await POST(request);

    expect(response.status).toBe(422);
    expect(upload).not.toHaveBeenCalled();
  });

  it('admin 세션이면 이미지를 업로드하고 public URL 을 반환한다', async () => {
    const upload = vi.fn().mockResolvedValue({ error: null });
    const getPublicUrl = vi.fn(() => {
      return { data: { publicUrl: 'https://cdn.example.com/image.png' } };
    });
    const from = vi.fn(() => {
      return { getPublicUrl, upload };
    });
    vi.mocked(requireAdmin).mockResolvedValue({
      client: { storage: { from } } as never,
      error: null,
    });

    const response = await POST(
      makeRequest(new File(['image'], 'image.png', { type: 'image/png' }))
    );
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
