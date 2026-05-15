// getOptionalSession 단위 테스트 — verifySession과 달리 redirect 없이 user|null만 반환
// 용도: 공개 페이지(SiteHeader 등)에서 "로그인 상태면 더 보여주고 아니면 무시" UX
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// next/headers는 Next 런타임 의존이라 테스트에선 가짜 모듈로 대체
vi.mock('next/headers', () => {
  return {
    cookies: vi.fn(),
  };
});

import { cookies } from 'next/headers';

import { getOptionalSession } from '@/lib/auth/getOptionalSession';

describe('getOptionalSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('access_token 쿠키가 없으면 백엔드 호출 없이 null을 반환한다', async () => {
    (cookies as Mock).mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    });

    const result = await getOptionalSession();

    expect(result).toBeNull();
    // 토큰 없으면 fetch 호출 자체가 없어야 함 (불필요한 네트워크 차단)
    expect(global.fetch).not.toHaveBeenCalled();
  });

  describe('access_token 쿠키가 있을 때', () => {
    beforeEach(() => {
      (cookies as Mock).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      });
    });

    it('백엔드 200 응답이면 user 객체를 반환한다', async () => {
      const mockUser = {
        id: 'u1',
        email: 'a@b.c',
        createdAt: '2026-01-01T00:00:00.000Z',
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockUser),
      });

      const result = await getOptionalSession();

      expect(result).toEqual(mockUser);
    });

    it('백엔드 401(좀비 쿠키)이면 redirect 없이 null을 반환한다', async () => {
      // 만료된 access_token이 남아있는 케이스 — verifySession과 달리 redirect 안 함
      (global.fetch as Mock).mockResolvedValue({
        ok: false,
        status: 401,
      });

      const result = await getOptionalSession();

      expect(result).toBeNull();
    });

    it('백엔드 5xx도 redirect 없이 null을 반환한다', async () => {
      // 백엔드 일시 장애가 공개 페이지를 깨뜨리면 안 됨 — 헤더는 비로그인 상태로 graceful degrade
      (global.fetch as Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      const result = await getOptionalSession();

      expect(result).toBeNull();
    });

    it('fetch 호출 시 access_token을 Cookie 헤더에 담아 보낸다', async () => {
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 'u1',
          email: 'a@b.c',
          createdAt: '2026-01-01T00:00:00.000Z',
        }),
      });

      await getOptionalSession();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            cookie: 'access_token=valid-token',
          }),
          // SC fetch는 cache: 'no-store' 필수 — 사용자 간 캐시 누설 방지 (ADR 0005)
          cache: 'no-store',
        })
      );
    });

    it('fetch 자체가 throw해도 null을 반환한다 (네트워크 오류 graceful)', async () => {
      // 백엔드 자체가 죽었거나 네트워크 단절 — 공개 페이지 렌더가 깨지면 안 됨
      (global.fetch as Mock).mockRejectedValue(new Error('ECONNREFUSED'));

      const result = await getOptionalSession();

      expect(result).toBeNull();
    });
  });
});
