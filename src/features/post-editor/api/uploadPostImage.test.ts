import { beforeEach, describe, expect, it, vi } from 'vitest';
import { uploadPostImage } from './uploadPostImage';

describe('uploadPostImage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          path: 'posts/image.png',
          url: 'https://cdn.example.com/image.png',
        }),
      })
    );
  });

  it('admin image API 로 파일을 전송한다 (세션 쿠키 자동 전달)', async () => {
    const file = new File(['image'], 'image.png', { type: 'image/png' });

    await expect(uploadPostImage(file)).resolves.toEqual({
      path: 'posts/image.png',
      url: 'https://cdn.example.com/image.png',
    });

    expect(fetch).toHaveBeenCalledWith('/api/admin/images', {
      method: 'POST',
      body: expect.any(FormData),
    });
  });

  it('업로드 실패 응답이면 throw 한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: vi.fn(),
    } as unknown as Response);

    const file = new File(['image'], 'image.png', { type: 'image/png' });

    await expect(uploadPostImage(file)).rejects.toThrow(
      'Image upload failed: 401'
    );
  });
});
