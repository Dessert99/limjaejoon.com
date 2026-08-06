import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '어드민 로그인',
  // robots.txt 와 별개로 페이지 자체도 색인을 거부한다
  robots: { index: false, follow: false },
};

export { AdminLoginPage as default } from '@/pages/admin-login';
