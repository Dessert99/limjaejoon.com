import { buildPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata({
  title: '랩',
  description: '제품이 되기 전의 실험과 만들다 만 것들',
  path: '/lab',
});

export default function LabPage() {
  return <main className='min-h-svh' />;
}
