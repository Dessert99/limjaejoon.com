import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '블로그',
  description: '읽고 만들며 배운 것을 정리해 둔 글 목록',
};

export { BlogPage as default } from '@/pages/blog';
