// verifySession 단위 테스트 — Server Component 환경 의존성을 mock으로 대체
// 실제 cookies()·fetch()·redirect()는 Next.js 런타임이 필요하므로 vi.mock으로 가짜 함수를 주입한다
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// vi.mock 호출은 vitest가 파일 최상단으로 자동 hoisting하므로 import보다 먼저 실행됨
// next/headers, next/navigation은 Next 런타임 의존이라 테스트에선 가짜 모듈로 대체 필수
vi.mock('next/headers', () => {
  return {
    cookies: vi.fn(),
  };
});
vi.mock('next/navigation', () => {
  return {
    // 실제 Next의 redirect는 호출 시 throw로 흐름을 끊는데, 테스트도 같은 동작을 흉내내야 한다
    redirect: vi.fn((url: string) => {
      throw new Error(`NEXT_REDIRECT:${url}`);
    }),
  };
});

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { verifySession } from '@/lib/auth/verifySession';

describe('verifySession', () => {
  // 각 테스트 시작 전 mock 호출 이력·구현을 초기화 — 테스트 간 독립성 보장
  beforeEach(() => {
    vi.clearAllMocks();
    // global.fetch도 매 테스트마다 fresh — 직전 테스트의 응답이 새 테스트에 영향 주는 것 방지
    global.fetch = vi.fn();
  });

  describe('access_token 쿠키가 없을 때', () => {
    it('백엔드 호출 없이 즉시 /login으로 redirect한다', async () => {
      // Arrange — get('access_token')이 undefined를 반환하도록 cookies() mock 주입
      (cookies as Mock).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      });

      // Act + Assert — redirect가 throw하므로 rejects matcher로 검증
      await expect(verifySession('/me')).rejects.toThrow(/NEXT_REDIRECT/);

      // redirect 호출 인자 검증 — returnTo 파라미터에 currentPath가 URL 인코딩되어 들어가야 함
      expect(redirect).toHaveBeenCalledWith('/login?returnTo=%2Fme');

      // 쿠키 없을 때 백엔드 fetch는 호출되지 않아야 함 (불필요한 네트워크 차단)
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('access_token 쿠키가 있을 때', () => {
    // "쿠키 있음" 케이스들의 공통 셋업 — 매번 같은 mock 반복 방지
    beforeEach(() => {
      (cookies as Mock).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      });
    });

    it('백엔드 200 응답이면 user 객체를 반환한다', async () => {
      // Arrange — fetch가 200 + user JSON을 응답하도록 mock
      const mockUser = {
        id: 'u1',
        email: 'a@b.c',
        createdAt: '2026-01-01T00:00:00.000Z',
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockUser),
      });

      // Act
      const result = await verifySession('/me');

      // Assert — 객체 비교는 toEqual (toBe는 참조 비교라 객체엔 부적합)
      expect(result).toEqual(mockUser);
      // 정상 흐름에선 redirect가 호출되면 안 됨
      expect(redirect).not.toHaveBeenCalled();
    });

    it('백엔드 401이면 /login으로 redirect한다', async () => {
      // Arrange — fetch가 401(인증 실패) 응답
      (global.fetch as Mock).mockResolvedValue({
        ok: false,
        status: 401,
      });

      // Act + Assert — 401도 access_token 부재와 동일하게 /login?returnTo=... 처리
      await expect(verifySession('/me')).rejects.toThrow(/NEXT_REDIRECT/);
      expect(redirect).toHaveBeenCalledWith('/login?returnTo=%2Fme');
    });

    it('백엔드 5xx도 동일하게 /login으로 redirect한다', async () => {
      (global.fetch as Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(verifySession('/me')).rejects.toThrow(/NEXT_REDIRECT/);
      expect(redirect).toHaveBeenCalled();
    });

    it('fetch 호출 시 access_token을 Cookie 헤더에 담아 보낸다', async () => {
      // Arrange — 응답은 200으로 정상 흐름
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 'u1',
          email: 'a@b.c',
          createdAt: '2026-01-01T00:00:00.000Z',
        }),
      });

      // Act
      await verifySession('/me');

      // Assert — fetch가 받은 인자 검증 (URL은 부분 일치, 옵션은 포함 검증)
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

    it('returnTo 쿼리스트링에 currentPath가 URL 인코딩되어 들어간다', async () => {
      (global.fetch as Mock).mockResolvedValue({ ok: false, status: 401 });

      // 슬래시·물음표·등호 등 특수 문자가 모두 %인코딩되어야 함
      await expect(verifySession('/me/profile?tab=info')).rejects.toThrow();

      expect(redirect).toHaveBeenCalledWith(
        '/login?returnTo=%2Fme%2Fprofile%3Ftab%3Dinfo'
      );
    });
  });
});
