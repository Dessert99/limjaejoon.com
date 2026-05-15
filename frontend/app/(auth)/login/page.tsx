// 로그인 라우트 — LoginForm을 Suspense로 감싼 thin 진입점
// LoginForm 내부의 useSearchParams는 Next.js 15+에서 Suspense boundary 필수
import { Suspense } from 'react';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
  description: '이메일과 비밀번호로 로그인합니다.',
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
