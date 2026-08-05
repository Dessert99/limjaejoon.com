import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개',
  description: '어떤 문제를 어떻게 풀어 왔는지',
};

export { AboutPage as default } from '@/pages/about';
