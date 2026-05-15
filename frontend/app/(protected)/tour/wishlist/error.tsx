'use client';
// /tour/wishlist error boundary — 401이면 /login으로 redirect, 그 외 에러는 reset 버튼 제공 (ADR 0004 §5)
// Next.js App Router의 error.tsx는 클라이언트 컴포넌트여야 하며 자동으로 ErrorBoundary로 감싸진다
import { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WishlistErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    // axios 에러일 때 status 코드 추출 — useSuspenseQuery가 axios 에러를 그대로 throw
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;

    if (status === 401) {
      // 인증 만료 → 로그인 페이지로 이동하며 returnTo 전달
      router.replace('/login?returnTo=/tour/wishlist');
    }
  }, [error, router]);

  // 401 처리 중에는 redirect 완료 전 빈 화면 (깜빡임 최소화)
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (status === 401) {
    return null;
  }

  return (
    <div
      role='alert'
      style={{
        textAlign: 'center',
        padding: '4rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>
      <p style={{ color: 'var(--color-danger, #ff6b6b)', fontSize: '1rem' }}>
        위시리스트를 불러오는 중 오류가 발생했습니다.
      </p>
      <button
        type='button'
        onClick={reset}
        style={{
          padding: '0.5rem 1.5rem',
          borderRadius: '0.375rem',
          border: '1px solid currentColor',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}>
        다시 시도
      </button>
    </div>
  );
}
