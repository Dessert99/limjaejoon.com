import type { Metadata } from 'next';

/** 공개 블로그 목록 route metadata */
export const metadata: Metadata = {
  title: '기술 블로그',
  description: '프론트엔드와 제품 개발 과정에서 쌓은 기술 기록',
  alternates: { canonical: '/blog' },
};

export { default } from '@/pages/blog';
