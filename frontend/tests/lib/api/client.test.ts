// apiClient 인터셉터 통합 테스트 — 사전 refresh + 뮤텍스 + 401 fallback (ADR 0004 핵심 로직)
// MSW로 백엔드 응답을 컨트롤하고, 실제 axios 인터셉터가 돌아가는지 검증
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { apiClient } from '@/lib/api/client';
import { clearAuth, setAccessExpiresAt } from '@/lib/api/tokenStore';

// MSW server — 모든 HTTP 요청을 가로채 핸들러로 응답시킨다 (axios도 XHR 통해 가로채짐)
const server = setupServer();

// 모든 테스트 시작/종료 시 server lifecycle 관리
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers(); // 매 테스트 후 핸들러 초기화 (테스트 간 영향 차단)
  clearAuth(); // tokenStore도 초기화 (accessExpiresAt + refreshPromise)
});
afterAll(() => server.close());

// 백엔드 베이스 URL — apiClient의 baseURL과 일치 (NEXT_PUBLIC_API_BASE_URL 미설정 시 기본값)
const BASE = 'http://localhost:4000';

// 테스트용 accessExpiresAt 값 — 만료 임박/충분 케이스 분리
const FAR_FUTURE = () => Date.now() + 60 * 60 * 1000; // 1시간 뒤
const NEAR_EXPIRY = () => Date.now() + 30 * 1000; // 30초 뒤 — 60초 임계 안쪽

describe('apiClient 인터셉터', () => {
  describe('사전 refresh (request interceptor)', () => {
    it('만료까지 충분(>60s) → refresh 호출 없이 원 요청 진행', async () => {
      // Arrange — refresh 발생하면 fail로 표시할 카운터
      let refreshCount = 0;
      server.use(
        http.post(`${BASE}/auth/refresh`, () => {
          refreshCount++;
          return HttpResponse.json({ user: {}, accessExpiresAt: 0 });
        }),
        http.get(`${BASE}/auth/me`, () => {
          return HttpResponse.json({
            id: 'u1',
            email: 'a@b.c',
            createdAt: '2026-01-01',
          });
        })
      );
      setAccessExpiresAt(FAR_FUTURE());

      // Act
      const response = await apiClient.get('/auth/me');

      // Assert — 사전 refresh는 발생하지 않아야 함
      expect(refreshCount).toBe(0);
      expect(response.status).toBe(200);
    });

    it('만료 임박(≤60s) → refresh 후 원 요청', async () => {
      let refreshCount = 0;
      server.use(
        http.post(`${BASE}/auth/refresh`, () => {
          refreshCount++;
          return HttpResponse.json({
            user: { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' },
            accessExpiresAt: Date.now() + 60 * 60 * 1000,
          });
        }),
        http.get(`${BASE}/auth/me`, () => {
          return HttpResponse.json({
            id: 'u1',
            email: 'a@b.c',
            createdAt: '2026-01-01',
          });
        })
      );
      setAccessExpiresAt(NEAR_EXPIRY());

      // Act
      const response = await apiClient.get('/auth/me');

      // Assert — 사전 refresh 정확히 1회
      expect(refreshCount).toBe(1);
      expect(response.status).toBe(200);
    });

    it('동시 요청 3개도 refresh는 1회만 발생한다 (뮤텍스)', async () => {
      let refreshCount = 0;
      server.use(
        http.post(`${BASE}/auth/refresh`, async () => {
          refreshCount++;
          // 약간의 지연 — 여러 요청이 같은 Promise를 await하도록
          await new Promise((r) => setTimeout(r, 10));
          return HttpResponse.json({
            user: { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' },
            accessExpiresAt: Date.now() + 60 * 60 * 1000,
          });
        }),
        http.get(`${BASE}/auth/me`, () => {
          return HttpResponse.json({
            id: 'u1',
            email: 'a@b.c',
            createdAt: '2026-01-01',
          });
        })
      );
      setAccessExpiresAt(NEAR_EXPIRY());

      // Act — 3개 동시 발사
      const responses = await Promise.all([
        apiClient.get('/auth/me'),
        apiClient.get('/auth/me'),
        apiClient.get('/auth/me'),
      ]);

      // Assert — refresh는 단 1회만 (모두 같은 Promise를 공유)
      expect(refreshCount).toBe(1);
      expect(responses).toHaveLength(3);
      expect(responses.every((r) => r.status === 200)).toBe(true);
    });
  });

  describe('401 fallback (response interceptor)', () => {
    it('401 응답이면 refresh 1회 후 원 요청 재시도하여 성공시킨다', async () => {
      let meCallCount = 0;
      let refreshCount = 0;
      server.use(
        http.get(`${BASE}/auth/me`, () => {
          meCallCount++;
          // 첫 호출: 401 / 두 번째 호출(재시도): 200
          if (meCallCount === 1) {
            return new HttpResponse(null, { status: 401 });
          }
          return HttpResponse.json({
            id: 'u1',
            email: 'a@b.c',
            createdAt: '2026-01-01',
          });
        }),
        http.post(`${BASE}/auth/refresh`, () => {
          refreshCount++;
          return HttpResponse.json({
            user: { id: 'u1', email: 'a@b.c', createdAt: '2026-01-01' },
            accessExpiresAt: Date.now() + 60 * 60 * 1000,
          });
        })
      );
      setAccessExpiresAt(FAR_FUTURE()); // 사전 refresh 분기는 안 타게

      // Act
      const response = await apiClient.get('/auth/me');

      // Assert — me는 2번(첫 401 + 재시도), refresh는 1번
      expect(meCallCount).toBe(2);
      expect(refreshCount).toBe(1);
      expect(response.status).toBe(200);
    });

    it('refresh 자체가 실패하면 원 요청 재시도 없이 401을 그대로 reject한다', async () => {
      server.use(
        http.get(`${BASE}/auth/me`, () => {
          return new HttpResponse(null, { status: 401 });
        }),
        http.post(`${BASE}/auth/refresh`, () => {
          // refresh도 실패 → 인증 복구 불가 → 401 fallback이 onAuthFailure 호출
          return new HttpResponse(null, { status: 401 });
        })
      );
      setAccessExpiresAt(FAR_FUTURE());

      // Act + Assert — 최종적으로 reject
      await expect(apiClient.get('/auth/me')).rejects.toThrow();
    });
  });
});
