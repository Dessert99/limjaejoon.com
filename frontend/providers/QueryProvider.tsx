'use client';
// TanStack Query 전역 Provider — 공식 App Router 가이드 기준 (ADR 0007)
// useState 패턴은 React가 boundary 없이 suspend되면 재생성 위험이 있어 deprecated.
// 대신 getQueryClient()의 isServer 분기 + 모듈 싱글턴으로 안전하게 처리한다.
import { useEffect } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/navigation';

import { registerAuthFailureHandler } from '@/lib/api/client';

import { getQueryClient } from './queryClient';

// QueryClientProvider + ReactQueryDevtools(dev) + 401 fallback 핸들러 주입
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 브라우저 싱글턴 또는 요청별 서버 인스턴스 — 환경에 따라 자동 분기
  const queryClient = getQueryClient();
  const router = useRouter();

  // 401 fallback 콜백 등록 — lib/api/client는 router·QueryClient에 직접 의존 불가, 콜백 주입으로 우회
  useEffect(() => {
    registerAuthFailureHandler(() => {
      queryClient.clear();
      router.push('/login');
    });
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 DevTools 표시 */}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
